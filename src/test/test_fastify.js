const fastify = require('fastify')({
    'disableRequestLogging': true        
})

fastify.get('/', async (request, reply) => {
    reply.type('text/html;charset=utf-8').code(200)
    return "hello";
})
fastify.listen(7000, "0.0.0.0", (err, address) => {
    if (err) {
        console.error("server listen error", erorr);
        throw err
    }
    fastify.log.info(`server listening on ${address}`)
})