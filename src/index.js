/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npx wrangler dev src/index.js` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npx wrangler publish src/index.js --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
	async fetch(request) {
		let clockOut;
		const date = new Date();
		const hours = date.getHours();
		const minutes = date.getMinutes();
		if(hours === 7){
			clockOut = false;
		} else if(hours === 12 && minutes > 30){
			clockOut = true;
		} else if(hours === 12 && minutes <= 30){
			clockOut = false;
		} else if(hours === 3){
			clockOut = true
		}
		const clockInMessage = `It is ${date.toLocaleDateString()}. Time to clock in`;
		const clockOutMessage = `It is ${date.toLocaleDateString()}. Time to clock out`
		const requestConfig = new Request("https://api.mailchannels.net/tx/v1/send", {
			"method": "POST",
			"headers": {
				"content-type": "application/json",
			},
			"body": JSON.stringify({
				"personalizations": [
					{
						"to": [{
							"email": "miller.tyler094@gmail.com",
							"name": "Tyler"
						}]
					}
				],
				"from": {
					"email": "test@mailinator.com",
					"name": "Tyler",
				},
				"subject": "Kronos Time :O",
				"content": [{
					"type": "text/plain",
					"value": clockOut ? clockOutMessage: clockInMessage,
				}],
			}),
		})
		const resp = await fetch(requestConfig);
		// const respText = await resp.text();
		// console.log("here: " + respText);
		// console.log(resp.status);
		return new Response(JSON.stringify(clockOut));
	},
};
