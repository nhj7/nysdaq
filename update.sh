pm2 delete nysdaq_batch;
pm2 start ./src/app/nysdaq_batch.js --name nysdaq_batch;
pm2 delete nysdaq_server;
pm2 start ./src/app/nysdaq_server.js --name nysdaq_server;