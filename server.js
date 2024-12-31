/** @format */

'use strict';

const { Server } = require('./src/app');
const {
	app: { port }
} = require('./src/configs/init.config');
const server = Server.listen(port, () => {
	const { port, address } = server.address(); // Lấy port từ đối tượng address
	console.log(`Server:: ${address}: ${port}`);
});
process.on('SIGINT', () => {
	server.close(() => console.log(`Exit Server Express`));
	// app.notify.send("ping")
});
