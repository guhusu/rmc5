if(localStorage["is_reg_push"]==undefined || localStorage["is_reg_push"]==''){
	localStorage["is_reg_push"]='no';//是否已在google play或apple store 註冊
}
if(localStorage["not_read_count"]==undefined || localStorage["not_read_count"]==''){
	localStorage["not_read_count"]=0;//未讀的數量
}
if(localStorage["board_not_read_count"]==undefined || localStorage["board_not_read_count"]==''){
	localStorage["board_not_read_count"]=0;//未讀的數量
}
if(localStorage["news_not_read_count"]==undefined || localStorage["news_not_read_count"]==''){
	localStorage["news_not_read_count"]=0;//未讀的數量
}
if(localStorage['pushmsg_data']==undefined) localStorage['pushmsg_data']='';//已儲存
if(localStorage['pushmsg_tmp']==undefined) localStorage['pushmsg_tmp']='';//末顯示儲存的
if(localStorage['pushmsg_bugnum']==undefined) localStorage['pushmsg_bugnum']='';
if(localStorage['pushmsg_regid']==undefined) localStorage['pushmsg_regid']='';//註冊id
if(localStorage['pushmsg_page_id']==undefined) localStorage['pushmsg_page_id']='';//收到訊息換頁id

var PDA={type:'manual',cid:'1',pid:'election',ek:'xdiejsijaijeiijsiwje2371(212'};
var pushNotification;

//收到推播換頁資料處理
function push_change_page(n)
{//alert('push - '+n+' -- '+RMC._NOWID);
	//依實際app做處理
	switch(n)
	{
		case 2://政見公告的最新公告
			if(RMC._NOWID!='news'){
				ch_news(2);
				RMC.changepage('news');
			}else ch_news(2);
			break;
		case 3://留言版
			if(RMC._NOWID!='board'){
				RMC.changepage('board');
			}
			break;
		default:break;
	}
	//localStorage['pushmsg_page_id']='';
}
//推播設定開始
function push_start()
{//alert(localStorage['pushmsg_regid']);
	try 
    { 
		pushNotification = window.plugins.pushNotification;
		if(device.platform == 'android' || device.platform == 'Android') {
			
			//寫入到parse
			/*var GameScore = Parse.Object.extend("Installation");
			var gameScore = new GameScore();
			 
			gameScore.set("appIdentifier", 'tw.app4u.manual.election');
			gameScore.set("appName", '洪宗楷');
			gameScore.set("appVersion", '0.0.1');
			gameScore.set("deviceToken", localStorage['pushmsg_regid']);
			gameScore.set("deviceType", device.uuid.toLowerCase());
			gameScore.set("pushType", device.platform.toLowerCase());
			 
			gameScore.save(null, {
			  success: function(gameScore) {
			    // Execute any logic that should take place after the object is saved.
			    //alert('New object created with objectId: ' + gameScore.id);
			   alert('parse ok');
			
			  },
			  error: function(gameScore, error) {
			    // Execute any logic that should take place if the save fails.
			    // error is a Parse.Error with an error code and description.
			    alert('Failed to create new object, with error code: ' + error.description);
				  //RMC.alert('資料寫入失敗!<br>請重新送傳送','資料填寫錯誤','確定');
			  }
			});*/
			
			/*$.ajax({
		        type: 'post',
		        headers: {'X-Parse-Application-Id':'o8t5y3kN4G8WgshKbbPl2r6uxjPcKQkDajEs06Sm','X-Parse-Rest-API-Key':'Y4Y1aqbOg61iC9FlShfx7VAB4ynbJJClPFBuemLQ'},
		        url: "https://api.parse.com/1/installations/mrmBZvsErB",
		        data: {"deviceType": "ios", "deviceToken": "01234567890123456789", "channels": [""]},
		        contentType: "application/json",
		        success: function(response){
		            alert("Success " + response);   
		        },
		        error: function(error){
		            alert("Error " + error.message);    
		        }
		    });*/
			
			
		    //localStorage["appname"]
			//if(localStorage['pushmsg_regid']=='') 
			pushNotification.register(successHandler, errorHandler, {"senderID":"754846154787","ecb":"onNotificationGCM"}); 
			//if(localStorage["is_reg_push"]='no') pushNotification.register(successHandler, errorHandler, {"senderID":"754846154787","ecb":"onNotificationGCM"});                // required!
		} else {
			pushNotification.register(tokenHandler, errorHandler, {"badge":"true","sound":"true","alert":"true","ecb":"onNotificationAPN"});        // required!
		}
	}
    catch(err) 
    { 
            txt="有一個錯誤 \n\n";//"There was an error on this page.\n\n"; 
            txt+=err.message;//"Error description: " + err.message + "\n\n"; 
            RMC.alert(txt,"推播錯誤提示","確認");
    } 
}

function tokenHandler (result) {
	localStorage["is_reg_push"]='yes';
}

function successHandler (result) {
	localStorage["is_reg_push"]='yes';
}

function errorHandler (error) {
    RMC.alert(error,"推播錯誤提示","確認");
}

//handle APNS notifications for iOS
function onNotificationAPN(e) {
    if (e.alert) {
         $("#pushul").append('<li>push-notification: ' + e.alert + '</li>');
         navigator.notification.alert(e.alert);
    }
        
    if (e.sound) {
        var snd = new Media(e.sound);
        snd.play();
    }
    
    if (e.badge) {
        pushNotification.setApplicationIconBadgeNumber(successHandler, e.badge);
    }
}

// handle GCM notifications for Android
function onNotificationGCM(e) {//alert(e.event);
	/*var tt='';
	for(var j in e){
		tt +=j+'='+e[j]+'  ';
		//alert(j);
	}
	alert(tt);*/
	//tt='';
	/*for(var k in e['payload']){
		tt +=k+'='+e['payload'][k]+'  ';
	}
	alert(tt);*/
	//alert(device.uuid+ ' ==> ');
	switch( e.event )
	{
		case 'registered'://註冊
			//alert(e.regid.length);
			if ( e.regid.length > 0 )
			{
				localStorage['pushmsg_regid']=e.regid;
				var url="http://www.app4u.tw/sendpush/reg_device_regid";	
				$.post(url,{regid:e.regid,cid:device.uuid,pid:PDA.pid,type:PDA.type},function(data){//alert(data);
					if(data.status=='y' || data.status=='n3'){
						localStorage["is_reg_push"]='ok';
					}
				},"json");
			}
		break;

		case 'message':
			//localStorage["not_read_count"] +=1;
			var tmp=e.payload.message.split('!');
			var n=tmp.length;
			switch(n)
			{
				case 2://最新消息
					if(RMC._NOWID!='news'){
						localStorage["news_not_read_count"]=parseInt(localStorage["news_not_read_count"])+1;
						if(localStorage["news_not_read_count"]>9){
							$('#news_nums').css('opacity',1).html('9+');
						}else{
							$('#news_nums').css('opacity',1).html(localStorage["news_not_read_count"]);
						}
					}
					break;
				case 3://留言版
					if(RMC._NOWID!='board') {
						localStorage["board_not_read_count"]=parseInt(localStorage["board_not_read_count"])+1;
						if(localStorage["board_not_read_count"]>9){
							$('#board_nums').css('opacity',1).html('9+');
						}else{
							$('#board_nums').css('opacity',1).html(localStorage["board_not_read_count"]);
						}
					}
					break;
				default:break;
			}
			if (e.foreground)
			{
				//執行中
				//push_change_page(n);
				//localStorage['pushmsg_page_id']=n;
			}else{
				if(e.coldstart){
					//末執行
					setTimeout(function(){
						push_change_page(n);
					},1000);
					//localStorage['pushmsg_page_id']=n;
					//push_change_page(localStorage['pushmsg_page_id']);
				}else{
					//在背景執行
					push_change_page(n);
					///localStorage['pushmsg_page_id']=n;
					//push_change_page(localStorage['pushmsg_page_id']);
				}
			}
			break;
	
		case 'error':
			//$("#pushul").append('<li>ERROR -> MSG:' + e.msg + '</li>');
			break;
		default:
			//$("#pushul").append('<li>EVENT -> Unknown, an event was received and we do not know what it is</li>');
			break;
	}
}
