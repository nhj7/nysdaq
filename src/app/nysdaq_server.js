
const server = require("./server")

const main = async () => {
    try {
        await server.startServerFastify();    
    } catch (error) {
        console.error("server error", error);
    }
    
}
main();

