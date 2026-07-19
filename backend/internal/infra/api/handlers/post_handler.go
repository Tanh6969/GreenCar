package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"greencar/internal/domain/entities"
	"greencar/internal/infra/api/dto"
	"greencar/internal/infra/api/middlewares"
	"greencar/internal/infra/api/response"
	"greencar/internal/service"

	"github.com/go-chi/chi/v5"
)

type PostHandler struct {
	svc *service.PostService
}

func NewPostHandler(svc *service.PostService) *PostHandler {
	return &PostHandler{svc: svc}
}

func toPostResponse(p *entities.BlogPost) *dto.BlogPostResponse {
	var cat *dto.BlogCategoryResponse
	if p.Category != nil {
		cat = &dto.BlogCategoryResponse{
			CategoryID: p.Category.CategoryID,
			Name:       p.Category.Name,
			Slug:       p.Category.Slug,
		}
	}

	var auth *dto.BlogAuthorResponse
	if p.Author != nil {
		auth = &dto.BlogAuthorResponse{
			UserID: p.Author.UserID,
			Name:   p.Author.Name,
			Email:  p.Author.Email,
		}
	}

	return &dto.BlogPostResponse{
		PostID:       p.PostID,
		UserID:       p.UserID,
		Category:     cat,
		Author:       auth,
		Title:        p.Title,
		Slug:         p.Slug,
		Excerpt:      p.Excerpt,
		Content:      p.Content,
		CoverImage:   p.CoverImage,
		Status:       p.Status,
		RejectReason: p.RejectReason,
		PublishedAt:  p.PublishedAt,
		CreatedAt:    p.CreatedAt,
		UpdatedAt:    p.UpdatedAt,
	}
}

func paginationParams(r *http.Request, defaultLimit int) (limit, offset int) {
	limit = defaultLimit
	q := r.URL.Query()
	if l := q.Get("limit"); l != "" {
		if v, err := strconv.Atoi(l); err == nil && v > 0 {
			limit = v
		}
	}
	if o := q.Get("offset"); o != "" {
		if v, err := strconv.Atoi(o); err == nil && v >= 0 {
			offset = v
		}
	}
	return
}

// ── Public ────────────────────────────────────────────────────

func (h *PostHandler) ListPublished(w http.ResponseWriter, r *http.Request) {
	limit, offset := paginationParams(r, 20)
	posts, err := h.svc.ListPublished(limit, offset)
	if err != nil {
		response.WriteError(w, http.StatusInternalServerError, "failed to fetch posts")
		return
	}
	out := make([]*dto.BlogPostResponse, 0, len(posts))
	for _, p := range posts {
		out = append(out, toPostResponse(p))
	}
	response.WriteJSON(w, http.StatusOK, out)
}

func (h *PostHandler) GetBySlug(w http.ResponseWriter, r *http.Request) {
	slug := chi.URLParam(r, "slug")
	p, err := h.svc.GetBySlug(slug)
	if err != nil {
		response.WriteError(w, http.StatusNotFound, "post not found")
		return
	}
	response.WriteJSON(w, http.StatusOK, toPostResponse(p))
}

func (h *PostHandler) ListCategories(w http.ResponseWriter, r *http.Request) {
	cats, err := h.svc.ListCategories()
	if err != nil {
		response.WriteError(w, http.StatusInternalServerError, "failed to fetch categories")
		return
	}
	out := make([]*dto.BlogCategoryResponse, 0, len(cats))
	for _, c := range cats {
		out = append(out, &dto.BlogCategoryResponse{CategoryID: c.CategoryID, Name: c.Name, Slug: c.Slug})
	}
	response.WriteJSON(w, http.StatusOK, out)
}

// ── User (auth required) ──────────────────────────────────────

func (h *PostHandler) ListMyPosts(w http.ResponseWriter, r *http.Request) {
	payload := middlewares.GetPayload(r)
	if payload == nil {
		response.WriteError(w, http.StatusUnauthorized, "unauthorized")
		return
	}
	limit, offset := paginationParams(r, 50)
	posts, err := h.svc.ListByUser(int(payload.UserId), limit, offset)
	if err != nil {
		response.WriteError(w, http.StatusInternalServerError, "failed to fetch posts")
		return
	}
	out := make([]*dto.BlogPostResponse, 0, len(posts))
	for _, p := range posts {
		out = append(out, toPostResponse(p))
	}
	response.WriteJSON(w, http.StatusOK, out)
}

func (h *PostHandler) CreatePost(w http.ResponseWriter, r *http.Request) {
	payload := middlewares.GetPayload(r)
	if payload == nil {
		response.WriteError(w, http.StatusUnauthorized, "unauthorized")
		return
	}
	var req dto.CreatePostRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.WriteError(w, http.StatusBadRequest, "invalid request body")
		return
	}
	if req.Title == "" {
		response.WriteError(w, http.StatusBadRequest, "title is required")
		return
	}
	p := &entities.BlogPost{
		UserID:     int(payload.UserId),
		CategoryID: req.CategoryID,
		Title:      req.Title,
		Slug:       req.Slug,
		Excerpt:    req.Excerpt,
		Content:    req.Content,
		CoverImage: req.CoverImage,
	}
	if err := h.svc.CreatePost(p); err != nil {
		response.WriteError(w, http.StatusBadRequest, err.Error())
		return
	}
	response.WriteJSON(w, http.StatusCreated, toPostResponse(p))
}

func (h *PostHandler) UpdatePost(w http.ResponseWriter, r *http.Request) {
	payload := middlewares.GetPayload(r)
	if payload == nil {
		response.WriteError(w, http.StatusUnauthorized, "unauthorized")
		return
	}
	id, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		response.WriteError(w, http.StatusBadRequest, "invalid post id")
		return
	}
	var req dto.UpdatePostRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.WriteError(w, http.StatusBadRequest, "invalid request body")
		return
	}
	p := &entities.BlogPost{
		PostID:     id,
		UserID:     int(payload.UserId),
		CategoryID: req.CategoryID,
		Title:      req.Title,
		Slug:       req.Slug,
		Excerpt:    req.Excerpt,
		Content:    req.Content,
		CoverImage: req.CoverImage,
	}
	if err := h.svc.UpdatePost(p); err != nil {
		code := http.StatusBadRequest
		if err.Error() == "forbidden" {
			code = http.StatusForbidden
		}
		response.WriteError(w, code, err.Error())
		return
	}
	updated, _ := h.svc.GetByID(id)
	response.WriteJSON(w, http.StatusOK, toPostResponse(updated))
}

func (h *PostHandler) SubmitPost(w http.ResponseWriter, r *http.Request) {
	payload := middlewares.GetPayload(r)
	if payload == nil {
		response.WriteError(w, http.StatusUnauthorized, "unauthorized")
		return
	}
	id, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		response.WriteError(w, http.StatusBadRequest, "invalid post id")
		return
	}
	if err := h.svc.SubmitForReview(id, int(payload.UserId)); err != nil {
		code := http.StatusBadRequest
		if err.Error() == "forbidden" {
			code = http.StatusForbidden
		}
		response.WriteError(w, code, err.Error())
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func (h *PostHandler) WithdrawPost(w http.ResponseWriter, r *http.Request) {
	payload := middlewares.GetPayload(r)
	if payload == nil {
		response.WriteError(w, http.StatusUnauthorized, "unauthorized")
		return
	}
	id, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		response.WriteError(w, http.StatusBadRequest, "invalid post id")
		return
	}
	if err := h.svc.WithdrawPost(id, int(payload.UserId)); err != nil {
		code := http.StatusBadRequest
		if err.Error() == "forbidden" {
			code = http.StatusForbidden
		}
		response.WriteError(w, code, err.Error())
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func (h *PostHandler) DeletePost(w http.ResponseWriter, r *http.Request) {
	payload := middlewares.GetPayload(r)
	if payload == nil {
		response.WriteError(w, http.StatusUnauthorized, "unauthorized")
		return
	}
	id, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		response.WriteError(w, http.StatusBadRequest, "invalid post id")
		return
	}
	if err := h.svc.DeletePost(id, int(payload.UserId)); err != nil {
		code := http.StatusBadRequest
		if err.Error() == "forbidden" {
			code = http.StatusForbidden
		}
		response.WriteError(w, code, err.Error())
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

// ── Admin ─────────────────────────────────────────────────────

func (h *PostHandler) AdminListPosts(w http.ResponseWriter, r *http.Request) {
	page, limit, offset := response.ParsePagination(r, 50)
	posts, total, err := h.svc.AdminListAll(limit, offset)
	if err != nil {
		response.WriteError(w, http.StatusInternalServerError, "failed to fetch posts")
		return
	}
	out := make([]*dto.BlogPostResponse, 0, len(posts))
	for _, p := range posts {
		out = append(out, toPostResponse(p))
	}
	response.WritePaginatedJSON(w, http.StatusOK, out, page, limit, total)
}

func (h *PostHandler) AdminSetStatus(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		response.WriteError(w, http.StatusBadRequest, "invalid post id")
		return
	}
	var req dto.SetStatusRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.WriteError(w, http.StatusBadRequest, "invalid request body")
		return
	}
	if req.Status != "published" && req.Status != "rejected" {
		response.WriteError(w, http.StatusBadRequest, "status must be published or rejected")
		return
	}
	if err := h.svc.AdminSetStatus(id, req.Status, req.RejectReason); err != nil {
		response.WriteError(w, http.StatusInternalServerError, err.Error())
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func (h *PostHandler) AdminDeletePost(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		response.WriteError(w, http.StatusBadRequest, "invalid post id")
		return
	}
	if err := h.svc.AdminDeletePost(id); err != nil {
		response.WriteError(w, http.StatusInternalServerError, err.Error())
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

// GetPost is used by admin GET /admin/posts/{id}
func (h *PostHandler) GetPost(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		response.WriteError(w, http.StatusBadRequest, "invalid post id")
		return
	}
	p, err := h.svc.GetByID(id)
	if err != nil {
		response.WriteError(w, http.StatusNotFound, "post not found")
		return
	}
	response.WriteJSON(w, http.StatusOK, toPostResponse(p))
}
