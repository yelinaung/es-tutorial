#!/bin/bash 

docker run --network=elastic -d docker.elastic.co/beats/metricbeat:7.10.2 setup -E setup.kibana.host=kib01:5601 -E 'output.elasticsearch.hosts=["es01:9200"]'
