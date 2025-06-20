#!/bin/bash
curl http://localhost:18888 -d '{"jsonrpc": "2.0", "method": "metashrew_height", "params": [], "id": 1}' -H 'Content-Type: application/json' -X POST
