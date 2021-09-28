const { WAConnection, Browsers } = require('@adiwajshing/baileys')
const { color, bgcolor } = require('./lib/color')
const fs = require("fs-extra")
const figlet = require('figlet')
const { uncache, nocache } = require('./lib/loader')
const setting = JSON.parse(fs.readFileSync('./setting.json'))
const welcome = require('./message/group')
baterai = 'unknown'
charging = 'unknown'

//nocache
require('./iky.js')
nocache('../iky.js', module => console.log(color('[WATCH]', 'cyan'), color(`'${module}'`, 'green'), 'File is updated!'))
require('./message/group.js')
nocache('../message/group.js', module => console.log(color('[WATCH]', 'cyan'), color(`'${module}'`, 'green'), 'File is updated!'))

const starts = async (iky = new WAConnection()) => {
	iky.logger.level = 'warn'
	console.log(color(figlet.textSync('KunzxD~', {
		font: 'Standard',
		horizontalLayout: 'default',
		vertivalLayout: 'default',
		width: 80,
		whitespaceBreak: false
	}), 'cyan'))
	console.log(color('ARA ARA', 'cyan'), color('Owner is online now!!', 'green'))
	console.log(color('ARA ARA', 'cyan'), color('Welcome Back, Owner!!', 'green'))
	iky.browserDescription = ["iky", "Firefox", "3.0.0"];

	// Menunggu QR
	iky.on('qr', () => {
		console.log(color('[', 'white'), color('!', 'red'), color(']', 'white'), color('Scan Qr Max 20 Dtk'))
	})

	// Menghubungkan
	fs.existsSync(`./${setting.sessionName}.json`) && iky.loadAuthInfo(`./${setting.sessionName}.json`)
	iky.on('connecting', () => {
		console.log(color('SYSTEM', 'yellow'), color('PROSES....'));
	})

	//connect
	iky.on('open', () => {
		console.log(color('SYSTEM', 'yellow'), color('SUKSES TERHUBUNG'));
	})

	// session
	await iky.connect({
		timeoutMs: 30 * 1000
	})
	fs.writeFileSync(`./${setting.sessionName}.json`, JSON.stringify(iky.base64EncodedAuthInfo(), null, '\t'))

	// Baterai
	iky.on('CB:action,,battery', json => {
		global.batteryLevelStr = json[2][0][1].value
		global.batterylevel = parseInt(batteryLevelStr)
		baterai = batterylevel
		if (json[2][0][1].live == 'true') charging = true
		if (json[2][0][1].live == 'false') charging = false
		console.log(json[2][0][1])
		console.log('Baterai : ' + batterylevel + '%')
	})
	global.batrei = global.batrei ? global.batrei : []
	iky.on('CB:action,,battery', json => {
		const batteryLevelStr = json[2][0][1].value
		const batterylevel = parseInt(batteryLevelStr)
		global.batrei.push(batterylevel)
	})
	// welcome
	iky.on('group-participants-update', async (anu) => {
		await welcome(iky, anu)
	})

	iky.on('chat-update', async (message) => {
		require('./iky.js')(iky, message)
	})
}

starts()