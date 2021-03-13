pm2 kill -f nysdaq_batch



pm2 restart ./src/app/nysdaq_batch.js --name nysdaq_batch
pm2 stop nysdaq_server
