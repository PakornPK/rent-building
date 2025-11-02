package buckets

import "context"

// NOTE: out of scope in 1st phase
// TODo: implement after finished 1st phase
type Bucket interface {
	GetObject(ctx context.Context, bucket, key string) ([]byte, error)
	PutObject(ctx context.Context, bucket, key string) error
}
