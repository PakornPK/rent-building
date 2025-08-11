package entities

type PaginationInput struct {
	Page       int                 `json:"page"`
	PageSize   int                 `json:"page_size"`
	Sort       string              `json:"sort"`
	Filter     map[string]string   `json:"filter"`
	FilterList map[string][]string `json:"filter_list,omitempty"`
}

type PaginationOutput[T any] struct {
	Data       []T   `json:"data"`
	Page       int   `json:"page"`
	PageSize   int   `json:"page_size"`
	TotalRows  int64 `json:"total_rows"`
	TotalPages int   `json:"total_pages"`
}
