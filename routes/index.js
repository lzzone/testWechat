var express = require('express');
var router = express.Router();
var crypto = require( 'crypto' );

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

const wechat = function(req,res){
	const {signature,timestamp,nonce,echostr} = req.query;
	if( !signature || !timestamp ||  !nonce ) {   //  echostr
		return res.send("验证失败");
	}
	if( req.method == 'GET' ) {
		if( !echostr ) {
			console.log( `get请求${req.body}` )
			res.send("验证失败");
		}
	}else if( req.method == 'POST' ) {
		console.log( req.body )
	}

	//token,timestamp,nonce三个参数进行字典排序
	const params = [token,timestamp,nonce];
	params.sort();
	const hash = crypto.createHash("sha1");
	const sign = hash.update( params.join("") ).digest("hex");

	if( signature === sign ) {
		if( req.method == "GET" ) {
			res.send("验证成功");
		}else if( req.method == "POST" ) {
			const xml = req.body.xml;
			const tousername = xml.fromusername[0].toString();
			const fromusername = xml.tousername[0].toString();
			const createtime = Math.round(Date.now() / 1000);
			const msgtype = xml.msgtype[0].toString();
			const content = xml.content[0].toString();
			const msgid = xml.msgid[0].toString();
			const response = `<xml>
					<ToUserName><![CDATA[${tousername}]]></ToUserName>
					<FromUserName><![CDATA[${fromusername}]]></FromUserName>
					<CreateTime>${createtime}</CreateTime>
					<MsgType><![CDATA[${msgtype}]]></MsgType>
					<Content><![CDATA[${content}]]></Content>
					<MsgId>${msgid}</MsgId>
				</xml>`;
			console.log( response )
			res.set('Content-Type', 'text/xml');
			res.send(response)
		}
	}else {
		res.send("验证错误");
	}
}

const token = "lz666studentweixin";
router.get("/wechat/verify",wechat)
router.post("/wechat/verify",wechat);

module.exports = router;
