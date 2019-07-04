import * as os from 'os';
const networkInterfaces = os.networkInterfaces();

let ip = "";
for (var key in networkInterfaces) {
    networkInterfaces[key].forEach(item => {
        if (!item.internal && item.family === "IPv4") {
            ip = item.address;
        }
    });
}

const port = 20100;

export default {
    ip,
    port
}