package logger

import (
	"log"
	"os"
)

// Logger provides simple leveled logging.
type Logger struct {
	info  *log.Logger
	warn  *log.Logger
	error *log.Logger
}

// New creates a new Logger writing to the given output.
func New() *Logger {
	flags := log.Ldate | log.Ltime | log.Lshortfile
	return &Logger{
		info:  log.New(os.Stdout, "INFO  ", flags),
		warn:  log.New(os.Stdout, "WARN  ", flags),
		error: log.New(os.Stderr, "ERROR ", flags),
	}
}

// Info logs an info message.
func (l *Logger) Info(format string, v ...interface{}) {
	l.info.Printf(format, v...)
}

// Warn logs a warning message.
func (l *Logger) Warn(format string, v ...interface{}) {
	l.warn.Printf(format, v...)
}

// Error logs an error message.
func (l *Logger) Error(format string, v ...interface{}) {
	l.error.Printf(format, v...)
}
