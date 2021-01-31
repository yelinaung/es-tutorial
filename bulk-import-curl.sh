curl -XPOST "http://localhost:9200/products/_bulk" \
    -H 'Content-Type: application/x-ndjson' \
    --data-binary "@products-bulk.json" | jq
