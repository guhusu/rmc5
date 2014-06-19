/*
 * name:	RMC
 * author:	guhusu
 * email:	guhusu@gmail.com
 * version:	5
 * description:開發對於cordoav執行的framework
 * 更新紀錄:
 * */
/*String.prototype.cutBr = function()
{
	return this.replace(/(^*\n*)|(^*\r*)/g,"");
}*/
String.prototype.ReplaceAll = function (AFindText,ARepText)
{
  raRegExp = new RegExp(AFindText,"g");
  return this.replace(raRegExp,ARepText);
};
Array.prototype.findval=function(val)
{
	var isck=false;
	for(var j in this)
	{
		if(this[j]==val){
			isck=true;
			break;
		}
	}
	
	return isck;
};
Array.prototype.delval=function(val)
{
	for(var j in this){
		if(this[j]==val) this.splice(j,1);
	}
};
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};
//---------------------2010.11.12-------------------------------
//作用：去除左右空白												
//輸入：無																												
//--------------------------------------------------------------
function trim(strvalue) { 
	ptntrim = /(^\s*)|(\s*$)/g; 
	return strvalue.replace(ptntrim,"");
//	return $.trim(strvalue);
}  
//---------------------2010.11.12-------------------------------
//作用：去除左空白												
//輸入：無																											
//--------------------------------------------------------------
function ltrim(strvalue) { 
	ptnltrim = /^\s*/g; 
	return strvalue.replace(ptnltrim,""); 
}
//---------------------2010.11.12-------------------------------
//作用：去除右空白												
//輸入：無																											
//--------------------------------------------------------------
function rtrim(strvalue) { 
	ptnrtrim = /\s$/g; 
	return strvalue.replace(ptnrtrim,""); 
}

function replaceAll(strOrg,strFind,strReplace){
	 var index = 0;
	 while(strOrg.indexOf(strFind,index) != -1){
	  strOrg = strOrg.replace(strFind,strReplace);
	  index = strOrg.indexOf(strFind,index);
	 }
	 return strOrg;
}
var RMC={
		_SH:0,//視窗寬度
		_SW:0,//視窗高度
		_NOWID:'',//現在使用的ID
		_PAGE_STORE:[],//頁的紀錄
		_CORDOVA_STATUS:false,//cordova status
		_CORDOVA_RUNDA:[],//cordova好了之後，執行的function
		_PAGE_EVENT:{'hidebefore':{},'hide':{},'showbefore':{},'show':{},'showone':{},'hideone':{},'hidebeforeone':{},'showbeforeone':{}},//事件 
		_RUNING:false,//動畫移動中
		_TMP:'',//暫存
		_PAGELOAD:{ids:[],per:0,addper:0,pid:'',hideid:''},//page載入
		_GALLERY:{},//gallery物件設定
		_RUNGALLERYID:'',//gallery正在使用中id
		_BACKDEL:[],//返回時關閉提示等、不使用移動特效
		_MAIN:{'move':0,'page':0,'nowid':0,'distance':0,'tdistance':0,'swpie':'','page_name':[]},//main設定值
		//name:元素id,start:是否可以顯示更新,h:開頭高度,images:圖片讀取,images_nums:圖片數量,loading:是否讀取中,data:暫存的資料,load_page:目前讀取的頁,val:紀錄scroll的值
		_RSC:{name:{},start:{},h:{},images:{},images_nums:{},load_nums:{},loading:{},data:{},load_page:{},val:{}},//自定的scroll事件
		_DOWNLIST:{},//downlist專用
		_POSTCALLBACK:{'n':'資料有錯','n2':'帳號重複'},//post回應參數值
		_PAGEMOVE:{'nowtop':{},'runing':{},'bottom':{},'usey':0,'usey_prev':0,'eventtop':{},'eventbottom':{},'loadpage':{},'searchkey':{},'more':{},'mx':{},'sid':{},'inittop':{}},//頁面滑動事件
		init:function(fun){
			this._TMP=fun;
		},
		//顯示選單
		showMenu:function(){
			$('#pageoverlay').css('display','');
			$('#menu').css('display','');
		},
		hide_Menu:function(){
			$('#pageoverlay').css('display','none');
			$('#menu').css('display','none');
		},
		urlget:function(title)
		{
		    var myurl=window.location.href.split("?");
		    if(myurl.length>1){
		        var txt=new Array();
		        var val=new Array();
		        var item=myurl[1].split('&');
		        var m=item.length;
		        var redata='';
		        for(i=0;i<m;i++)
		        {
		            var data=item[i].split('=');
		            if(data[0]==title) {
		                redata=data[1];
		                break;
		            }
		        }
		        return redata;
		    }
		    else return '';
		},
		//今日日期
		getToday:function(){
			var nd=new Date();
			var mm=parseInt(nd.getMonth()+1,10);
			var dd=parseInt(nd.getDate(),10);
			if(mm<10) mm='0'+mm;
			if(dd<10) dd='0'+dd;
			var str=nd.getFullYear()+'-'+mm+'-'+dd;
			
			return str;
		},
		create:function(){
			RMC._SW=$(window).width();
			RMC._SH=$(window).height();
			if(RMC._SW<1 || RMC._SH<1){
				var wh=RMC.urlget('wh').split('-');//
				RMC._SW=wh[0];
				RMC._SH=wh[1];
			}
			var HP=false;//header position
			var FP=false;//footer position
			var i=0;
			var hash=window.location.hash;
			//設定overlay
			$('#pageoverlay').css({position:'absolute','z-index':99,'display':'none',width:RMC._SW+'px',height:RMC._SH+'px','overflow':'hidden'});
			$('#pageoverlay').click(function(){
				RMC.hide_Menu();
			});
			$('#pageoverlay').swipe({swipe:function(){RMC.hide_Menu();},threshold:0});
			$('#menu').swipe({swipe:function(){RMC.hide_Menu();},threshold:0});
			$('#menu').swipe({tap:function(){RMC.hide_Menu();},threshold:50});
			$('#menu').css({position:'absolute','z-index':100,'display':'none',width:'200px',height:RMC._SH+'px','overflow':'hidden'});
			//$('#menu').
			//$('.menu-con').css({height:});
			//設定page
			$('.page').each(function(){
				var CH=RMC._SH;
				var chf=false;
				++i;
				//$(this).addClass("display-none");
				//$(this).attr('class','page display-none');
				$(this).css({'width':RMC._SW+'px','height':RMC._SH+'px','overflow':'hidden'});
				
				var content=$(this).find('.content');
				var header=$(this).find('.header');
				var footer=$(this).find('.footer');
				//HP=header.attr('data-position');
				if(header.length>0){
					HP=$(header).outerHeight(true);//alert('id='+this.id+' h='+HP);
					var headern=$(this).find('.header-nameb');
					if(headern.length>0) HP -=30;
					CH -=HP;
					chf=true;
				}
				//alert(footer.html());
				//for(var x in footer){
					//alert(x+' = '+footer[x]);
				//}
				if(footer.length>0){
					FP=footer.outerHeight(true);
					CH -=FP;
					//content.css('margin-bottom',FP+'px');
					FP=RMC._SH-FP;
					chf=true;
				}
				if(chf){
					if(!content){
						header.after('<div class="content" style="height:'+CH+'px;overflow:auto;"></div>');
					}else{
						content.css({'height':CH+'px','overflow':'auto'});
					}
				}else{
					//上下頁面時使用
					if(!content){
						header.after('<div class="content" style="height:'+CH+'px;overflow:auto;"></div>');
					}else{
						content.css({'height':CH+'px','overflow':'auto'});
					}
				}
				
				//一頁共用只有main　
				if(this.id=='main'){
					var icn=$(this).find('.icontent').length;
					if(icn>1){
						RMC._MAIN.page=icn;
						RMC._MAIN.nowid=1;
						RMC._MAIN.move=RMC._SW;
						RMC._MAIN.max=-(icn-1)*RMC._SW;
						icn_w=icn*RMC._SW;
						
						content.css({'width':icn_w+'px','overflow':'hidden'});//alert(CH+' -- '+RMC._SW);
						$(this).find('.icontent').css({'float':'left','height':CH+'px','width':RMC._SW+'px','box-sizing':'border-box','-webkit-box-sizing':'border-box','overflow':'auto','-webkit-transition':'all 1s linear'});
						var ici=1;
						$('.icontent').each(function(){
							$(this).attr('id','icn'+ici);
							ici +=1;
						});
						
						$('#main .content').swipe( {
							swipeStatus:function(event, phase, direction, distance , duration , fingerCount) {
								//移動時
								if(phase=="move"){
									RMC._MAIN.swipe=direction;
									if(direction=='left'){
										RMC._MAIN.distance=distance;
										//RMC._MAIN.swipe='left';
										var mar=RMC._MAIN.tdistance-distance;
										$(this).css('-webkit-transform',' translateX('+mar+'px)');
									}else if(direction=='right'){
										RMC._MAIN.distance=distance;
										//RMC._MAIN.swipe='right';
										var mar=RMC._MAIN.tdistance+distance;
										$(this).css('-webkit-transform',' translateX('+mar+'px)');
									}
								}
								
								//結束後
								if(phase === $.fn.swipe.phases.PHASE_END || phase === $.fn.swipe.phases.PHASE_CANCEL){
								
									if(RMC._MAIN.distance>100){
										if(RMC._MAIN.swipe=='left'){
											RMC._MAIN.tdistance -=RMC._SW;//alert(RMC._MAIN.tdistance+' -- '+RMC._MAIN.max);
											if(RMC._MAIN.tdistance<RMC._MAIN.max){
												RMC._MAIN.tdistance=RMC._MAIN.max;
											}else{
												RMC._MAIN.nowid +=1;
											}
											//if(RMC._MAIN.tdistance<RMC._GALLERY[id]['max']) RMC._GALLERY[RMC._RUNGALLERYID]['tdistance']=RMC._GALLERY[id]['max'];
										}
										if(RMC._MAIN.swipe=='right'){
											RMC._MAIN.tdistance +=RMC._SW;
											if(RMC._MAIN.tdistance>0) RMC._MAIN.tdistance=0;
											else{
												RMC._MAIN.nowid -=1;
											}
											//if(RMC._GALLERY[RMC._RUNGALLERYID]['tdistance']>0) RMC._GALLERY[RMC._RUNGALLERYID]['tdistance']=0;
										}
									}else{
										
									}
									//if(RMC._MAIN.tdistance>0) RMC._MAIN.tdistance=0;
									//alert(RMC._MAIN.tdistance);
									//if(RMC._MAIN.swipe=='left' || RMC._MAIN.swipe=='right'){	
										$('#main .content').css('-webkit-transform',' translateX('+RMC._MAIN.tdistance+'px)');
										//$('#main_name').html(RMC._MAIN.page_name[RMC._MAIN.nowid-1]);
										RMC.moveMainSwipe();
									//}
									//if(RMC._GALLERY[RMC._RUNGALLERYID]['tdistance']==0) RMC._GALLERY[id]['now']=0;
									//else RMC._GALLERY[id]['now']=Math.abs(RMC._GALLERY[RMC._RUNGALLERYID]['tdistance']/RMC._SW);
									
								}
							},
							allowPageScroll:"auto",
							threshold:100
					   });
					}
					
				}
				
				$(this).attr('class','page display-none');
				//if(hash=='' && i==1) {
				if(i==1) {
					RMC._NOWID=this.id;
					RMC._PAGE_STORE.push(this.id);
				}
				//
				var ln = $(this).find('.l-area').length;
				var rn = $(this).find('.r-area').length;
				if(ln>0 || rn>0){//alert(ln);
					if(ln>rn){
						ww=ln*41*2;
						ww=RMC._SW-ww;
						$(this).find('.header-namea').css('width',ww+'px');
					}else{
						ww=rn*41*2;
						ww=RMC._SW-ww;
						$(this).find('.header-namea').css('width',ww+'px');
					}
				}
			});
			if(hash!='')
			{
				hash=hash.substr(1);
				RMC._NOWID=hash;
				RMC._PAGE_STORE.push(hash);
			}
			$('#'+RMC._NOWID).attr('class','page');
			//設定事件
			$('[tap]').each(function(){
				$(this).swipe( {
		            tap:function(event, target) {
		            	eval($(this).attr('tap'));
		            },
		            threshold:50
		          });
			});
			
			//設定down-list
			//var mar=RMC._SH-200;
			//$('.down-list').css({'padding-top':mar+'px'});
			//mar=RMC._SW-10;
			//$('.down-list .sel').css('width',mar+'px');
			
			RMC.runCordova();
			//專換上方位置
			var ww=this._SW-146;
			$('.header-nameb').each(function(){
				$(this).css('width',ww+'px');
			});
			
			//其他共用設定值
			RMC.createDownList();
		},	
		//移動不紀錄上層
		changePagePrev:function(id){
			this._PAGE_STORE.pop();
			RMC.changepage(id);
		},
		changePage:function(id){RMC.changepage(id);},
		//初始頁說定
		initload:function(){
			
		},
		changepage:function(id){
			if(!RMC._RUNING){
				RMC._RUNING=true;
				//隱藏前
				if(RMC._PAGE_EVENT['hidebefore'][RMC._NOWID]!=undefined){
					eval(RMC._PAGE_EVENT['hidebefore'][RMC._NOWID]+"();");
				}
				if(RMC._PAGE_EVENT['hidebeforeone'][RMC._NOWID]!=undefined){
					eval(RMC._PAGE_EVENT['hidebeforeone'][RMC._NOWID]+"();");
					delete RMC._PAGE_EVENT['hidebeforeone'][RMC._NOWID];//執行一次後就不執行了
				}
				//顯示前
				if(RMC._PAGE_EVENT['showbefore'][id]!=undefined){
	                eval(RMC._PAGE_EVENT['showbefore'][id]+"();");
				}
				if(RMC._PAGE_EVENT['showbeforeone'][id]!=undefined){
	                eval(RMC._PAGE_EVENT['showbeforeone'][id]+"();");
	                delete RMC._PAGE_EVENT['showbeforeone'][id];
				}
				window.location.hash=id;
				this._PAGE_STORE.push(id);
				var hide_id=RMC._NOWID;
				var tmp='#'+RMC._NOWID;
				//$('#'+RMC._NOWID).attr('class','page display-none');
				$(tmp).attr('class','page');
				RMC._NOWID=id;
				//var nc=$('#'+id).attr('data-css');alert(nc);
				$('#'+id).attr('class','page-show slideInRight');
				setTimeout(function(){
					RMC._RUNING=false;
					//alert(id);
					//alert($('#'+id).outerWidth(true));
					//alert($('body').outerWidth(true));
					$('#'+id).attr('class','page'); 
					$(tmp).attr('class','page display-none');
					//顯示後
					if(RMC._PAGE_EVENT['showone'][id]!=undefined){
	                    //alert(RMC._PAGE_EVENT['show'][id]);
	                    eval(RMC._PAGE_EVENT['showone'][id]+"();");
	                    delete RMC._PAGE_EVENT['showone'][id];
					}
					if(RMC._PAGE_EVENT['show'][id]!=undefined){
	                    //alert(RMC._PAGE_EVENT['show'][id]);
	                    (RMC._PAGE_EVENT['show'][id])();//eval(RMC._PAGE_EVENT['show'][id]+"();");
					}
					//隱藏後
					if(RMC._PAGE_EVENT['hide'][hide_id]!=undefined){
	                    eval(RMC._PAGE_EVENT['hide'][hide_id]+"();");
					}
					if(RMC._PAGE_EVENT['hideone'][hide_id]!=undefined){
	                    eval(RMC._PAGE_EVENT['hideone'][hide_id]+"();");
	                    delete RMC._PAGE_EVENT['hideone'][hide_id];
					}
					//alert(RMC._PAGE_EVENT['show']);
				},1200);
			}
		},
		backPage:function(){RMC.backpage();},
		backpage:function(){
			if(RMC._BACKDEL.length>0){
				$('#'+RMC._BACKDEL[RMC._BACKDEL.length-1]).css('display','none');
				var tmp=RMC._BACKDEL.pop();
				if(tmp=='rgallery_big') $("#rgallery").swipe("enable");
				return false;
			}
			if(!RMC._RUNING){//alert(this._PAGE_STORE);
				if(this._PAGE_STORE.length>1){
					RMC._RUNING=true;
					//隱藏前
					if(RMC._PAGE_EVENT['hidebefore'][RMC._NOWID]!=undefined){
						eval(RMC._PAGE_EVENT['hidebefore'][RMC._NOWID]+"();");
					}
					if(RMC._PAGE_EVENT['hidebeforeone'][RMC._NOWID]!=undefined){
						eval(RMC._PAGE_EVENT['hidebeforeone'][RMC._NOWID]+"();");
						delete RMC._PAGE_EVENT['hidebeforeone'][RMC._NOWID];
					}
					var hide_id=RMC._NOWID;
					var tmp='#'+RMC._NOWID;
					$(tmp).attr('class','page-show rotateOutDownRight');
					//$('#'+RMC._NOWID).attr('class','page display-none');
					this._PAGE_STORE.pop();
					RMC._NOWID=this._PAGE_STORE[this._PAGE_STORE.length-1];//alert(RMC._NOWID);
					//顯示前
					if(RMC._PAGE_EVENT['showbefore'][RMC._NOWID]!=undefined){
		                eval(RMC._PAGE_EVENT['showbefore'][RMC._NOWID]+"();");
					}
					if(RMC._PAGE_EVENT['showbeforeone'][RMC._NOWID]!=undefined){
		                eval(RMC._PAGE_EVENT['showbeforeone'][RMC._NOWID]+"();");
		                delete RMC._PAGE_EVENT['showbeforeone'][RMC._NOWID];
					}
					$('#'+RMC._NOWID).attr('class','page');
					window.location.hash=RMC._NOWID;
					setTimeout(function(){
						RMC._RUNING=false;
					//	$('#'+RMC._NOWID).attr('class','page display-now');
						//alert($(tmp).attr('class'));
						//$(tmp).attr('class','page display-hidden');
						$(tmp).attr('class','page display-none');
						//顯示後
						if(RMC._PAGE_EVENT['show'][RMC._NOWID]!=undefined){
		                    //alert(RMC._PAGE_EVENT['show'][id]);
		                    eval(RMC._PAGE_EVENT['show'][RMC._NOWID]+"();");
						}
						if(RMC._PAGE_EVENT['showone'][RMC._NOWID]!=undefined){
		                    //alert(RMC._PAGE_EVENT['show'][id]);
		                    eval(RMC._PAGE_EVENT['showone'][RMC._NOWID]+"();");
		                    delete RMC._PAGE_EVENT['showone'][RMC._NOWID];
						}
						//隱藏後
						if(RMC._PAGE_EVENT['hide'][hide_id]!=undefined){
		                    eval(RMC._PAGE_EVENT['hide'][hide_id]+"();");
						}
						if(RMC._PAGE_EVENT['hideone'][hide_id]!=undefined){
		                    eval(RMC._PAGE_EVENT['hideone'][hide_id]+"();");
		                    delete RMC._PAGE_EVENT['hideone'][hide_id];
						}
					},1200);
					//var tmp=this._PAGE_STORE.pop();
					//alert(tmp);
				}else{
					if(this._CORDOVA_STATUS){
						navigator.app.exitApp();
					}
				}
			}
		},
		//載入html
		loadPage:function(file){RMC.loadpage(file);},
		loadpage:function(file){
			//alert(file);
			$.get(file,function(data){
				//alert(data); 
				data=data.ReplaceAll('class="page"','class="page-load"');
				$('body').append(data);
				RMC.pageset(file);
			},'text');
		},
		//執行page設定
		pageset:function(file){
			var HP=false;//header position 
			var FP=false;//footer position
			$('.page-load').each(function(){
				var CH=RMC._SH;
				var chf=false;
				$(this).css({'width':RMC._SW+'px','height':RMC._SH+'px','overflow':'hidden'});
				var content=$(this).find('.content');
				var header=$(this).find('.header');
				var footer=$(this).find('.footer');
				if(header){
					HP=$(header).outerHeight(true);
					CH -=HP;
					chf=true;
				}
				if(footer.length>0){
					FP=footer.outerHeight(true);
					CH -=FP;
					sFP=RMC._SH-FP;
					chf=true;
				}
				if(chf){
					if(!content){
						header.after('<div class="content" style="height:'+CH+'px;overflow:auto;"></div>');
					}else{
						content.css({'height':CH+'px','overflow':'auto'});
					}
				}else{
					//上下頁面時使用
					if(!content){
						header.after('<div class="content" style="height:'+CH+'px;overflow:auto;"></div>');
					}else{
						content.css({'height':CH+'px','overflow':'auto'});
					}
				}
				
				//設定事件
				$('#'+this.id+' [tap]').each(function(){
					$(this).swipe( {
			            tap:function(event, target) {
			            	eval($(this).attr('tap'));
			            },
			            threshold:50
			          });
				});
				
				//設定down-list
				//var mar=RMC._SH-200;
				//$('#'+this.id+' .down-list').css({'padding-top':mar+'px'});
				//mar=RMC._SW-10;
				//$('.down-list .con').css('width',mar+'px');
				//$('.down-list .sel').css('width',RMC._SW+'px');

				//專換上方位置
				var ww=this._SW-146;
				$('#'+this.id+' .header-nameb').each(function(){
					$(this).css('width',ww+'px');
				});
				
				$(this).attr('class','page display-none');
			});
			//檢查是否有計量
			//alert(file);
			if(this._PAGELOAD.ids.findval(file)){
				this._PAGELOAD.ids.delval(file);//alert(this._PAGELOAD.ids);
				if(this._PAGELOAD.ids.length<1) this._PAGELOAD.per=100;
				else this._PAGELOAD.per +=this._PAGELOAD.addper;
				//alert(this._PAGELOAD.ids[0]);
				if(this._PAGELOAD.ids[0]!=undefined){
					//alert(this._PAGELOAD.ids[0]);
					RMC.loadpage(this._PAGELOAD.ids[0]);
				}
				//alert($('body').html());
			}
		},
		//頁載入,載入後可導頁(陣列值,page id)
		start_load:function(pfile,pid,hideid){
			this._PAGELOAD.ids=pfile;
			this._PAGELOAD.per=0;
			this._PAGELOAD.addper=0;
			this._PAGELOAD.pid=pid;
			if(hideid!=undefined) this._PAGELOAD.hideid=hideid;//是否都載入完後刪除該id紀錄
			var nums=pfile.length;
			if(pid!=undefined) setTimeout('RMC.start_page_time()',200);
			this.loadpage(pfile[0]);
		},
		//檢查是否可以導頁了
		start_page_time:function(){
			if(this._PAGELOAD.per==100 || this._PAGELOAD.ids.length<1){
				this._PAGELOAD.addper=0;
				var pid=this._PAGELOAD.pid;
				this._PAGELOAD.pid='';//alert(pid);
				RMC.changepage(pid);
				if( this._PAGELOAD.hideid!=undefined){
					this._PAGE_STORE.delval(this._PAGELOAD.hideid);
					this._PAGELOAD.hideid='';
				}
			}else  setTimeout('RMC.start_page_time()',200);
		},
		//swipe event
		swipe:function(name,type,fn){
			if(type=='left'){//alert('left');
				$('#'+name).on('swipeleft',function(e){
					alert('left');
				});
				//$('#'+name).swipe();
				/*if(document.getElementById(name)){
					$('#'+name).css({left:'-'+RMC._SW+'px','z-index':2,'display':''}).animate({left:'0px'},500);
					$('#'+RMC._NOWID).animate({left:RMC._SW+'px','z-index':1},500,function(){
						$(this).css('display','none');
					});
					RMC._BACKID=RMC._NOWID;
					RMC._NOWID=name;
				}*/
			}else{
				$('#'+name).on('swiperight',function(e){
					alert('right');
				});
			}
		},
		//執行cordova
		runCordova:function(){
			document.addEventListener("deviceready", RMC.deviceReady, false);
		},
		//cordova執行完成
		deviceReady:function(){
			RMC._CORDOVA_STATUS=true;
			document.addEventListener("backbutton", RMC.backDown, false);
			//alert(RMC._CORDOVA_RUNDA);
			for(var i in RMC._CORDOVA_RUNDA){
				//alert(RMC._CORDOVA_RUNDA[i]);
				eval(RMC._CORDOVA_RUNDA[i]+'();');
			}
		},
		//設定cordova 開始時執行的函式
		add_event_cordova:function(fun){
			this._CORDOVA_RUNDA.push(fun);
		},
		//檢查是否有網路
		checkNetWork:function(){
			var st=false; 
			if(RMC._CORDOVA_STATUS){
				var networkState = navigator.connection.type;
				if(networkState.toLowerCase()=="none") st=false;
				else st=true;
			}else st=false;
			
			return st;
		},
		checkNetWorkShow:function(){
			if(!RMC.checkNetWork()){
				RMC.alert('請確定網路已經開啟!!','網路錯誤','確定');
			}
		},
		//執行back按鈕時
		backDown:function(){
			RMC.backpage();
		},
		//提示訊息
		alert:function(msg,title,name){
			if(this._CORDOVA_STATUS){
				navigator.notification.alert(msg, RMC.alertCallback, title, name);
			}else{
				alert(msg);
			}
		},
		alertCallback:function(){
			
		},
		//加入事件
		add_event:function(type,id,fun){alert(typeof(fun));
			this._PAGE_EVENT[type][id]=fun;
		},
		on:function(id,type,fun){
			switch(type)
			{
				case 'tap'://點擊
				case 'click'://點擊 
					$('#'+id).swipe({
						tap:fun,threshold:50	
					});
					break;
				case 'swipe':
					$('#'+id).swipe({swipe:fun,threshold:0});
					break;
				case 'swipeleft'://左滑
				case 'swipeLeft'://左滑
					$('#'+id).swipe({swipeLeft:fun,threshold:0});
					break;
				case 'swiperight'://右滑
				case 'swipeRight'://右滑
					$('#'+id).swipe({swipeRight:fun,threshold:0});
					break;
				case 'swipedown'://右滑
				case 'swipeDown'://右滑
					$('#'+id).swipe({swipeDown:fun,threshold:0});
					break;
				case 'swipeup'://右滑
				case 'swipeUp'://右滑
					$('#'+id).swipe({swipeUp:fun,threshold:0});
					break;
				default:break;
			}

		},
		tap:function(id,fun){
			$('#'+id).swipe({
				tap:fun,
				threshold:50
			});
		},
		click:function(id,fun){
			$('#'+id).swipe({
				tap:fun,
				threshold:50
			});
		},
		//設定 down-list
		/*setDownList:function(id){
			
		},
		selDownList:function(id,funv){
			$('#'+id).css('display','block');
			if(this._DOWNLIST[id]==undefined){
				var i=1;
				var name='';
				$('#'+id+' .bar').each(function(){
					name=id+i;
					$(this).attr('id',name);
					RMC._DOWNLIST[name] = new IScroll('#'+name, { mouseWheel: true ,snap: true});
					i++;
				});
				//this._DOWNLIST[id] = new IScroll('#wrapper', { mouseWheel: true ,snap: true});
			}
		},*/
		//執行推播
		runPush:function(){
			if(this._CORDOVA_STATUS){
				push_start();
			}else{
				setTimeout('RMC.runPush()',500);
			}
		},
		//設定gallery
		setGallery:function(id){
			RMC._GALLERY[id]={};
			RMC._GALLERY[id]['img']=[];//紀錄圖片
			RMC._GALLERY[id]['title']=[];//記錄圖片名稱
			RMC._GALLERY[id]['name']={};//紀錄檔案名稱-目前未使用
			RMC._GALLERY[id]['tdistance']=0;//總共移動的距離
			RMC._GALLERY[id]['distance']=0;//目前移動的距離
			RMC._GALLERY[id]['swipe']='';//目前移動的位置left or right
			RMC._GALLERY[id]['pinch']='';//目前縮放移動 in or out 
			RMC._GALLERY[id]['zoon']=1;//目前縮放比例
			RMC._GALLERY[id]['max']=RMC._SW;//最小負值,用於超過時反回，而不用講算數量
			RMC._GALLERY[id]['now']=0;//目前使用中圖片編號
			var i=0;
			var alt='';
			var src='';
			$('#'+id+' .gallery img').each(function(){
				src=$(this).attr('src');
				RMC._GALLERY[id]['img'][i]=new Image();
				RMC._GALLERY[id]['img'][i].src=src;
				alt=$(this).attr('alt');
				if(alt!=undefined) RMC._GALLERY[id]['title'][i]=alt;
				else RMC._GALLERY[id]['title'][i]='';
				$(this).attr('re',i);
				RMC._GALLERY[id]['max']　-=RMC._SW;
				++i;
			});
			var w=RMC._SW;
		    var h=RMC._SW;
		    if(w<200){
		        $(".gallery li").css("width","100%");
		        
		    }
		    if(w>=200 && w<600){
		        $(".gallery li").css("width","50%");
		        h *=0.5;
		    }
		    if(w>=600 && w<900){
		        $(".gallery li").css("width","33.33333%");
		        h *=0.33333;
		    }
		    if(w>=900 && w<1200){
		        $(".gallery li").css("width","25%");
		        h *=0.25;
		    }
		    if(w>=1200){
		        $(".gallery li").css("width","20%");
		        h *=0.20;
		    }
		    $(".gallery li img").css("height",h+"px");

		},
		//執行
		runGallery:function(id,obj){
			RMC._BACKDEL.push('rgallery');//RMC._BACKDEL='rgallery';//返回關閉用
			RMC._RUNGALLERYID=id;//加入執行中的id
			var sevent=false;
			if(!document.getElementById('rgallery')){
				//alert('ccc');
				$('body').prepend('<div id="rgallery" style="position:absolute;z-index:99;width:'+RMC._SW+'px;height:'+RMC._SH+'px;overflow:hidden;background:rgb(0,0,0);-webkit-animation-duration: 1s;-webkit-animation-fill-mode: both;"></div>');
			}else{
				$('#rgallery').css('display','');
				sevent=true;
			}
			//alert(src.width);400/200=x/150 400/2*150=x
			var si=$(obj).attr('re');
			RMC._GALLERY[id]['now']=si;
			var startnum=0-(si*RMC._SW);
			var da='';
			var img='';//alert(RMC._GALLERY[id]['img'].length);
			var sh=0;
			for(var i=0;i<RMC._GALLERY[id]['img'].length;i++){
				if(RMC._GALLERY[id]['img'][i].width>RMC._GALLERY[id]['img'][i].height){
					//計算高度位置
					sh=parseInt(RMC._SW/RMC._GALLERY[id]['img'][i].width*RMC._GALLERY[id]['img'][i].height);
					sh=parseInt((RMC._SH-sh)/2);
					if(sh>0) sh='style="margin-top:'+sh+'px;"';
					else sh='';
					img='<img src="'+RMC._GALLERY[id]['img'][i].src+'" width="'+RMC._SW+'" '+sh+' id="gcc'+i+'" />';
				}else img='<img src="'+RMC._GALLERY[id]['img'][i].src+'" height="'+RMC._SH+'" id="gcc'+i+'" />';
				da +='<div style="float:left;width:'+RMC._SW+'px;height:'+RMC._SH+'px;overflow:hidden;text-align:center;">'+img+'</div>';
			}//alert(da);
			var totalW=RMC._SW*RMC._GALLERY[id]['img'].length;//alert(totalW);
			$('#rgallery').html('<div id="rgallery_big" style="display:none;position:absolute;background:#000000;top:0px;width:'+RMC._SW+'px;height:'+RMC._SH+'px;z-index:100;"></div><div id="rgallery_cc" style="position:absolute;width:'+RMC._SW+'px;text-align:right;height:18px;z-index:99;"><a href="javascript:RMC.hideGallery();"><img src="css/images/gallery_close.png" border="0" style="border:#fff solid 1px;margin-top:10px;margin-right:20px;padding:3px;" /></a></div><div id="rgallery_div" style="width:'+totalW+'px;height:'+RMC._SH+'px;overflow:hidden;-webkit-transform:translateX('+startnum+'px);">'+da+'</div>');
			RMC._GALLERY[RMC._RUNGALLERYID]['tdistance']=startnum;
			if(!sevent){
				
				 /*$('#rgallery').swipe({
					 pinchStatus:function(event, phase, direction, distance , duration , fingerCount, pinchZoom) {
				        	$('#rgallery_cc').css('color','#ffffff').html("pinchStatuspinched " + distance + " px ");
				          if(phase === $.fn.swipe.phases.PHASE_END || phase === $.fn.swipe.phases.PHASE_CANCEL) {
				             //The handlers below fire after the status, 
				             // so we can change the text here, and it will be replaced if the handlers below fire
				        	  $('#rgallery_cc').css('color','#ffffff').html("No pinch was made");
				           }
				        },
				        fingers:2
				 });*/
				
				 $("#rgallery").swipe( {
					 pinchStatus:function(event, phase, direction, distance , duration , fingerCount, pinchZoom) {
						 //RMC.hideGallery();
						 //$('#rgallery_big').html('<div id="rgallery_hide" style="position:absolute;width:'+RMC._SW+'px;text-align:right;height:18px;z-index:99;overflow:scroll;"><a href="javascript:RMC.hideScaleGallery();"><img src="css/images/w/07.png" border="0" style="border:#fff solid 1px;margin-top:10px;margin-right:20px;padding:3px;" /></a></div><img src="'+RMC._GALLERY[id]['img'][RMC._GALLERY[id]['now']].src+'" />').css('display','');
						 RMC._BACKDEL.push('rgallery_big');
						 $('#rgallery_big').html('<div id="rgallery_hide" style="position:absolute;width:'+RMC._SW+'px;text-align:right;height:18px;z-index:199;"><a href="javascript:RMC.hideGallery();"><img src="css/images/gallery_close.png" border="0" style="border:#fff solid 1px;margin-top:10px;margin-right:20px;padding:3px;box-shadow:1px 1px 2px #000;" /></a></div><div style="width:'+RMC._SW+'px;height:'+RMC._SH+'px;overflow:auto;"><img src="'+RMC._GALLERY[id]['img'][RMC._GALLERY[id]['now']].src+'" /></div>').css('display','');
						 $("#rgallery").swipe("disable");
						 RMC._GALLERY[id]['tdistance']=0-(RMC._GALLERY[id]['now']*RMC._SW);
						 $('#rgallery_div').css('-webkit-transform',' translateX('+RMC._GALLERY[id]['tdistance']+'px)');
						 //alert(RMC._GALLERY[id]['now']);
						 //$('#rgallery_cc').css('color','#ffffff').html("pinchStatuspinched " + distance + " px Pinch zoom scale "+pinchZoom+"  Distance pinched "+distance+" Direction " + direction);
				          //if(phase === $.fn.swipe.phases.PHASE_END || phase === $.fn.swipe.phases.PHASE_CANCEL) {
				             //The handlers below fire after the status, 
				             // so we can change the text here, and it will be replaced if the handlers below fire
				        	 // $('#rgallery_cc').css('color','#ffffff').html("No pinch was made");
				           //}
				        	
				        	//if(phase=='move'){
				        	//	RMC._GALLERY[id]['zoon']=pinchZoom;
				        	//	$('#rgallery_div').css('-webkit-transform',' scale('+pinchZoom+','+pinchZoom+')');
				        	//$('#rgallery_div').css({'-webkit-transform':' scale('+pinchZoom+','+pinchZoom+')','-webkit-transform':' translateX('+RMC._GALLERY[RMC._RUNGALLERYID]['tdistance']+'px)',});
				        	//}
				        },
				        swipeStatus:function(event, phase, direction, distance , duration , fingerCount) {
				        	//$('#rgallery_cc').css('color','#ffffff').html("swipeStatusswiped " + distance + ' px');
				        	if(phase=="move"){
								if(direction=='left'){
									RMC._GALLERY[RMC._RUNGALLERYID]['distance']=distance;
									RMC._GALLERY[id]['swipe']='left';
									var mar=RMC._GALLERY[RMC._RUNGALLERYID]['tdistance']-distance;
									//$(event.target).css('margin-left',mar+'px');
									$('#rgallery_div').css('-webkit-transform',' translateX('+mar+'px)');
								}else if(direction=='right'){
									RMC._GALLERY[RMC._RUNGALLERYID]['distance']=distance;
									RMC._GALLERY[id]['swipe']='right';
									//var mar=barpadding+distance;
									var mar=RMC._GALLERY[RMC._RUNGALLERYID]['tdistance']+distance;
									//$(event.target).css('margin-left',mar+'px');
									$('#rgallery_div').css('-webkit-transform',' translateX('+mar+'px)');
								}
							}
							//if(phase=='end'){
								//$('#rgallery_cc').css('color','#ffffff').html($.fn.swipe.phases.PHASE_END+" - "+$.fn.swipe.phases.PHASE_CANCEL+" - "+phase+" - "+direction+' - '+distance);
							if(phase === $.fn.swipe.phases.PHASE_END || phase === $.fn.swipe.phases.PHASE_CANCEL){
								//$('#rgallery_cc').css('color','#ffffff').html(RMC._GALLERY[id]['distance']);
								if(RMC._GALLERY[id]['distance']>50){
									if(RMC._GALLERY[id]['swipe']=='left'){
										RMC._GALLERY[RMC._RUNGALLERYID]['tdistance'] -=RMC._SW;
										if(RMC._GALLERY[RMC._RUNGALLERYID]['tdistance']<RMC._GALLERY[id]['max']) RMC._GALLERY[RMC._RUNGALLERYID]['tdistance']=RMC._GALLERY[id]['max'];
									}
									if(RMC._GALLERY[id]['swipe']=='right'){
										RMC._GALLERY[RMC._RUNGALLERYID]['tdistance'] +=RMC._SW;
										if(RMC._GALLERY[RMC._RUNGALLERYID]['tdistance']>0) RMC._GALLERY[RMC._RUNGALLERYID]['tdistance']=0;
										//alert(RMC._GALLERY[RMC._RUNGALLERYID]['tdistance']);
									}
								}else{
									//$('#rgallery_div').css('-webkit-transform',' translateX('+RMC._GALLERY[RMC._RUNGALLERYID]['tdistance']+'px)');
								}
								$('#rgallery_div').css('-webkit-transform',' translateX('+RMC._GALLERY[RMC._RUNGALLERYID]['tdistance']+'px)');
								//barpadding=parseInt($(event.target).css('margin-left'));
								if(RMC._GALLERY[RMC._RUNGALLERYID]['tdistance']==0) RMC._GALLERY[id]['now']=0;
								else RMC._GALLERY[id]['now']=Math.abs(RMC._GALLERY[RMC._RUNGALLERYID]['tdistance']/RMC._SW);
								//alert(RMC._GALLERY[RMC._RUNGALLERYID]['tdistance']);
							}
				        },
				        /*
				        swipe:function(event, direction, distance, duration, fingerCount) {
				        	$('#rgallery_cc').css('color','#ffffff').html("swipeYou swiped " + direction + " with " + fingerCount + " fingers");
				        },*/
				        /*pinchIn:function(event, direction, distance, duration, fingerCount, pinchZoom) {
				        	$('#rgallery_cc').css('color','#ffffff').html("pinchInYou pinched " +direction + " by " + distance +"px, zoom scale is "+pinchZoom); 
				        },
				        pinchOut:function(event, direction, distance, duration, fingerCount, pinchZoom) {
				        	$('#rgallery_cc').css('color','#ffffff').html("You pinched " +direction + " by " + distance +"px, zoom scale is "+pinchZoom);
				        },*/
				        fingers:$.fn.swipe.fingers.ALL
				        //threshold:0
				      });
				
				/*$('#rgallery').swipe({
					swipeStatus:function(event,phase, direction, distance,duration,fingerCount ){
						$('#rgallery_cc').css('color','#ffffff').html($.fn.swipe.phases.PHASE_END+" - "+$.fn.swipe.phases.PHASE_CANCEL+" - "+phase+" - "+direction+' - '+distance);
						if(phase=="move"){
							if(direction=='left'){
								RMC._GALLERY[RMC._RUNGALLERYID]['distance']=distance;
								RMC._GALLERY[id]['swipe']='left';
								var mar=RMC._GALLERY[RMC._RUNGALLERYID]['tdistance']-distance;
								//$(event.target).css('margin-left',mar+'px');
								$('#rgallery_div').css('-webkit-transform',' translateX('+mar+'px)');
							}else if(direction=='right'){
								RMC._GALLERY[RMC._RUNGALLERYID]['distance']=distance;
								RMC._GALLERY[id]['swipe']='right';
								//var mar=barpadding+distance;
								var mar=RMC._GALLERY[RMC._RUNGALLERYID]['tdistance']+distance;
								//$(event.target).css('margin-left',mar+'px');
								$('#rgallery_div').css('-webkit-transform',' translateX('+mar+'px)');
							}
						}
						//if(phase=='end'){
							//$('#rgallery_cc').css('color','#ffffff').html($.fn.swipe.phases.PHASE_END+" - "+$.fn.swipe.phases.PHASE_CANCEL+" - "+phase+" - "+direction+' - '+distance);
						if(phase === $.fn.swipe.phases.PHASE_END || phase === $.fn.swipe.phases.PHASE_CANCEL){
							//$('#rgallery_cc').css('color','#ffffff').html(RMC._GALLERY[id]['distance']);
							if(RMC._GALLERY[id]['distance']>50){
								if(RMC._GALLERY[id]['swipe']=='left'){
									RMC._GALLERY[RMC._RUNGALLERYID]['tdistance'] -=RMC._SW;
									if(RMC._GALLERY[RMC._RUNGALLERYID]['tdistance']<RMC._GALLERY[id]['max']) RMC._GALLERY[RMC._RUNGALLERYID]['tdistance']=RMC._GALLERY[id]['max'];
								}
								if(RMC._GALLERY[id]['swipe']=='right'){
									RMC._GALLERY[RMC._RUNGALLERYID]['tdistance'] +=RMC._SW;
									if(RMC._GALLERY[RMC._RUNGALLERYID]['tdistance']>0) RMC._GALLERY[RMC._RUNGALLERYID]['tdistance']=0;
									//alert(RMC._GALLERY[RMC._RUNGALLERYID]['tdistance']);
								}
							}else{
								//$('#rgallery_div').css('-webkit-transform',' translateX('+RMC._GALLERY[RMC._RUNGALLERYID]['tdistance']+'px)');
							}
							$('#rgallery_div').css('-webkit-transform',' translateX('+RMC._GALLERY[RMC._RUNGALLERYID]['tdistance']+'px)');
							//barpadding=parseInt($(event.target).css('margin-left'));
						}
					},
					pinchIn:function(event, direction, distance, duration, fingerCount, pinchZoom){
						
					},
					pinchOut:function(event, direction, distance, duration, fingerCount, pinchZoom){
						
					},
					pinchStatus:function(event, phase, direction, distance , duration , fingerCount, pinchZoom) {
						//$(this).find('#pinch_text').text("pinched " + distance + " px ");
						$('#rgallery_cc').css('color','#ffffff').html($.fn.swipe.phases.PHASE_END+" - "+$.fn.swipe.phases.PHASE_CANCEL+" - "+phase+" - "+direction+' - '+distance+' - '+fingerCount+' - '+pinchZoom);
				        if(phase === $.fn.swipe.phases.PHASE_END || phase === $.fn.swipe.phases.PHASE_CANCEL) {
				             //The handlers below fire after the status, 
				             // so we can change the text here, and it will be replaced if the handlers below fire
				             //$(this).find('#pinch_text').text("No pinch was made");
				         }
				     },
					fingers:$.fn.swipe.fingers.ALL 
				});*/
				
				
				/* $("#rgallery").swipe( {
				        pinchIn:function(event, direction, distance, duration, fingerCount, pinchZoom)
				        {
				        	$('#rgallery_cc').css('color','#fff').html("You pinched " +direction + " by " + distance +"px, zoom scale is "+pinchZoom);
				          //$(this).text("You pinched " +direction + " by " + distance +"px, zoom scale is "+pinchZoom);
				        },
				        pinchOut:function(event, direction, distance, duration, fingerCount, pinchZoom)
				        {
				        	$('#rgallery_cc').html("You pinched " +direction + " by " + distance +"px, zoom scale is "+pinchZoom);
				          //$(this).text("You pinched " +direction + " by " + distance +"px, zoom scale is "+pinchZoom);
				        },
				        pinchStatus:function(event, phase, direction, distance , duration , fingerCount, pinchZoom) {
				        	$('#rgallery_cc').html("Pinch zoom scale "+pinchZoom+"  <br/>Distance pinched "+distance+" <br/>Direction " + direction);
				          //$(this).html("Pinch zoom scale "+pinchZoom+"  <br/>Distance pinched "+distance+" <br/>Direction " + direction);
				        },
				        fingers:2,  
				        pinchThreshold:0  
				      });*/
				/*$('#rgallery').swipe({swipeStatus:function(event, phase, direction, distance){
					//$('#rgallery_cc').html(event+" - "+phase+" - "+direction+' - '+distance);
					if(phase=='in'){
						alert('in');
					}
					if(phase=='out'){
						alert('out	');
					}
					
					if(phase=="move"){
						if(direction=='left'){
							RMC._GALLERY[RMC._RUNGALLERYID]['distance']=distance;
							RMC._GALLERY[id]['swipe']='left';
							var mar=RMC._GALLERY[RMC._RUNGALLERYID]['tdistance']-distance;
							//$(event.target).css('margin-left',mar+'px');
							$('#rgallery_div').css('-webkit-transform',' translateX('+mar+'px)');
						}else if(direction=='right'){
							RMC._GALLERY[RMC._RUNGALLERYID]['distance']=distance;
							RMC._GALLERY[id]['swipe']='right';
							//var mar=barpadding+distance;
							var mar=RMC._GALLERY[RMC._RUNGALLERYID]['tdistance']+distance;
							//$(event.target).css('margin-left',mar+'px');
							$('#rgallery_div').css('-webkit-transform',' translateX('+mar+'px)');
						}
					}
					
					if(phase=='end'){
						if(RMC._GALLERY[id]['distance']>50){
							if(RMC._GALLERY[id]['swipe']=='left'){
								RMC._GALLERY[RMC._RUNGALLERYID]['tdistance'] -=RMC._SW;
								if(RMC._GALLERY[RMC._RUNGALLERYID]['tdistance']<RMC._GALLERY[id]['max']) RMC._GALLERY[RMC._RUNGALLERYID]['tdistance']=RMC._GALLERY[id]['max'];
							}
							if(RMC._GALLERY[id]['swipe']=='right'){
								RMC._GALLERY[RMC._RUNGALLERYID]['tdistance'] +=RMC._SW;
								if(RMC._GALLERY[RMC._RUNGALLERYID]['tdistance']>0) RMC._GALLERY[RMC._RUNGALLERYID]['tdistance']=0;
								//alert(RMC._GALLERY[RMC._RUNGALLERYID]['tdistance']);
							}
						}else{
							//$('#rgallery_div').css('-webkit-transform',' translateX('+RMC._GALLERY[RMC._RUNGALLERYID]['tdistance']+'px)');
						}
						$('#rgallery_div').css('-webkit-transform',' translateX('+RMC._GALLERY[RMC._RUNGALLERYID]['tdistance']+'px)');
						//barpadding=parseInt($(event.target).css('margin-left'));
					}
				}, allowPageScroll:"vertical"});*/
			}
			/*$('#rgallery').swipe({swipe:function(event, direction, distance, duration, fingerCount){
				//alert(direction+' -- '+distance);
				if(direction=='left'){
					$('#rgallery_div').css('-webkit-transform',' translateX(-'+distance+'px)');
				}else{
					$('#rgallery_div').css('-webkit-transform',' translateX('+distance+'px)');
				}
			},threshold:0});*/
		},
		hideGallery:function(){
			if(RMC._BACKDEL.length>0){
				$('#'+RMC._BACKDEL[RMC._BACKDEL.length-1]).css('display','none');
				var tmp=RMC._BACKDEL.pop();
				if(tmp=='rgallery_big') $("#rgallery").swipe("enable");
				return false;
			}
		},
		//頁面跳出訊息(qrcode)
		openDigtal:function(src){
			
			if(!document.getElementById('qroverlay')){
				$('body').prepend('<div id="qroverlay" style="position:absolute;width:'+RMC._SW+'px;height:'+RMC._SH+'px;z-index:50;background:rgba(0,0,0,0.7);"></div>');
			}
			var img=new Image();
			img.onload=function(){
				var ww=img.width;
				var hh=img.height;
				//設定是否有拉霸
				if(ww>RMC._SW || hh>RMC._SH){
					$('#qroverlay').css('overflow','auto');
				}else $('#qroverlay').css('overflow','hide');
				//設定位置
				var left=Math.floor((RMC._SW-ww)/2)-5;
				var top=Math.floor((RMC._SH-hh)/2)-5;
				if(left<0) left=0;
				if(top<0) top=0;
				ww +=15;
				hh +=55;
				$('#qroverlay').html('<div style="position:relative;text-align:center;border-radius:5px;padding:5px;width:'+ww+'px;height:'+hh+'px;background:rgb(255,255,255);margin-top:'+top+'px;margin-left:'+left+'px;"><img src="'+img.src+'" border="0"  /><br><span class="openbtn" onclick="RMC.hideDigtal()">關閉</span></div>').css('display','');
			};
			img.src=src;
			
		},
		//關閉跳出訊息
		hideDigtal:function(){
			$('#qroverlay').css('display','none');
		},
		//設定page-load
		setPageLoad:function(){
			var pl=Math.floor((RMC._SW-64)/2);
			var pt=Math.floor((RMC._SH-64)/2);
			if(!document.getElementById('page-loading')){
				$('body').prepend('<div id="page-loading" style="position:absolute;background:rgba(0,0,0,0.5);width:'+RMC._SW+'px;height:'+RMC._SH+'px;z-index:40;display:none;"><img src="img/load.gif" style="margin-left:'+pl+'px;margin-top:'+pt+'px;" /></div>');
			}
			$('#page-loading').css('display','');
		},
		hidePageLoad:function(){
			$('#page-loading').css('display','none');
		},
		//parse時間轉換
		parse_date:function(dd){
			var nd = new Date(dd);
			var yy=nd.getFullYear();
			var mm=nd.getMonth()+1;
			var dd=nd.getDate();
			var hh=nd.getHours();
			var hm=nd.getMinutes();
			var d=yy+'-'+mm+'-'+dd+' '+hh+':'+hm;
			
			return d;
		},
		//檢查輸入值
		check_value:function(value,type){
			var ckstr='';
			switch(type)
			{
				case 'mail':
					re = new RegExp(/^(([0-9a-zA-Z_.]+)|([0-9a-zA-Z]+[_.0-9a-zA-Z-]*[0-9a-zA-Z_.]+))@([a-zA-Z0-9-]+[.])+([a-zA-Z]{2}|net|NET|com|COM|gov|GOV|mil|MIL|org|ORG|edu|EDU|int|INT|biz|BIZ|idv|IDV|cc|CC)$/);
	                ckstr=re.test(value); 
					break;
				default:
					break;
			}
			
			return ckstr;
		},
		contentToBottom:function(id)
		{
			//alert('cc');
			var name='#'+id+' .content';
			$(name).scrollTop($(name)[0].scrollHeight);
			//alert($('#'+id+' .content').scrollTop());
		},
		//移動main
		mainMovePage:function(number){
			RMC._MAIN.nowid=number;
			RMC._MAIN.tdistance=-(number-1)*RMC._MAIN.move;
			$('#main .content').css('-webkit-transform',' translateX('+RMC._MAIN.tdistance+'px)');
			$('#main_name').html(RMC._MAIN.page_name[RMC._MAIN.nowid-1]);
			$('#main_menus .cc').removeClass('cc');
			$('.iim'+number).addClass('cc');
			//document.getElementById('')
			//$('#main_menus'+number+' .itx').addClass('cc');
		},
		//移動main swipe
		moveMainSwipe:function(){
			$('#main_name').html(RMC._MAIN.page_name[RMC._MAIN.nowid-1]);
			$('#main_menus .cc').removeClass('cc');
			$('.iim'+RMC._MAIN.nowid).addClass('cc');
		},
		//設定名稱
		mainSetName:function(da){
			RMC._MAIN.page_name=da;
		},
		//初始化scroll
		rScrollInit:function(id){
			//_RSC:{name:{},start:{},h:{},images:{},images_nums:{},loading:{},data:{},load_page:{},val:{}},//自定的scroll事件
		},
		//載入圖片
		rScrollImgLoad:function(id,src){
			RMC._RSC['loading'][id]=true;alert(typeof(RMC._RSC['images_nums'][id]));
			if(typeof(RMC._RSC['images_nums'][id])=='undefined') {
				RMC._RSC['images_nums'][id]=0;
				RMC._RSC['load_nums'][id]=0;
				RMC._RSC['images'][id]=[];
			}
			var nx=RMC._RSC['images_nums'][id];
			RMC._RSC['images_nums'][id] +=1;
			RMC._RSC['images'][id][nx]=new Image();
			RMC._RSC['images'][id][nx].src = src; 
			RMC._RSC['images'][id][nx].onload = function () 
			{ 
				//document.body.appendChild(Img); 
				RMC._ISC['load_nums'][id] +=1;//alert(RMC._ISC['image_load']['article']+' -- '+RMC._ISC['image_nums']['article']);
				if(RMC._RSC['images_nums'][id]==RMC._ISC['load_nums'][id]){
					RMC._RSC['loading'][id]=false;
					var h=$('#'+id).height();
					//隱藏或還沒有設定
					if(typeof(RMC._RSC['val'][id].bottom)!=undefined){
						//RMC._RSC['val'][id].bottom=
					}
				}
			}
		},
		//設定scroll
		rScrollSet:function(da){
			RMC._RSC['name'][da.id]=da.id;
			var JID='#'+da.id;
			RMC._RSC['val'][da.id]={'head_id':'','head_html':'','height':0,'start_h':0,'start':0,'bottom':0,'now':0,'distance':0,'tdistance':0,'swpie':'','sx':0,'sy':0,'ssy':0,isupdate:false,show:false,isload:false};
			//alert($('#'+da.id).height()+' -- '+$('#'+da.id).outerHeight()+' -- '+$('#'+da.id).outerHeight(true)+' -- '+da.updateid);
			RMC._RSC['val'][da.id].height=$(JID).height();alert($(JID).height()+' -- '+$(JID).outerHeight());
			//if(da.updateid!=undefined && da.updateid==true){
				da.updateid=da.id+'_ss';
				RMC._RSC['val'][da.id].head_html='<div id="'+da.updateid+'" class="iscroller-update" ><span class="pullDownIcon"></span><span class="pullDownLabel"></span></div>';
				document.getElementById(da.id).innerHTML=RMC._RSC['val'][da.id].head_html+document.getElementById(da.id).innerHTML;
				RMC._RSC['val'][da.id].start_h=document.getElementById(da.updateid).offsetHeight;
				document.getElementById(da.updateid).style.display='none';
				//$(JID).scrollTop(RMC._RSC['val'][da.id].start_h);//設定開始高度
				RMC._RSC['val'][da.id].head_id=da.updateid;
			//}
			RMC._RSC['val'][da.id].bottom=$(JID).scrollTop();
			//$(JID).css('pointer-events','none');
			$(JID).on({
				'touchstart':function(e){
					if(RMC._RSC['val'][da.id].isload) event.stopPropagation();
					if(RMC._RSC['val'][da.id].isupdate) event.stopPropagation();
					RMC._RSC['val'][da.id].now=$(this).scrollTop();
					if (event.targetTouches.length == 1) {
			    	    var touch = event.targetTouches[0];
			    	    RMC._RSC['val'][da.id].sx=touch.pageX;
			    	    RMC._RSC['val'][da.id].ssy=touch.pageY;
			    	  }
				},
				'touchmove':function(e){
					if(RMC._RSC['val'][da.id].isload) event.stopPropagation();
					if(RMC._RSC['val'][da.id].isupdate) event.stopPropagation();
					if (event.targetTouches.length == 1) {
			    	    var touch = event.targetTouches[0];
			    	    RMC._RSC['val'][da.id].sx=touch.pageX;
			    	    RMC._RSC['val'][da.id].sy=touch.pageY;
			    	  }
					
					if(RMC._RSC['val'][da.id].now==0){//alert('c');
						var mar=RMC._RSC['val'][da.id].ssy-RMC._RSC['val'][da.id].sy;
						if(mar<0){//alert(mar);
							RMC._RSC['val'][da.id].show=true;
							$('#'+RMC._RSC['val'][da.id].head_id).css('display','');
							mar=RMC._RSC['val'][da.id].start_h+mar;
							//$('#'+RMC._RSC['val'][da.id]).css('scrollTop',mar+'px');
							if(!document.getElementById(RMC._RSC['val'][da.id].head_id).className.match('iscroller-update flip')) {
								document.getElementById(RMC._RSC['val'][da.id].head_id).className = 'iscroller-update start';
								document.getElementById(RMC._RSC['val'][da.id].head_id).querySelector('.pullDownLabel').innerHTML = '下拉以更新';
							}
							if(mar<0){
								$(JID).scrollTop(0);
								mar=-(mar);
								$(JID).css('-webkit-transform',' translateY('+mar+'px)');
								RMC._RSC['val'][da.id].isupdate=true;
								if(document.getElementById(RMC._RSC['val'][da.id].head_id).className.match('iscroller-update start')) {
									document.getElementById(RMC._RSC['val'][da.id].head_id).className = 'iscroller-update flip';
									document.getElementById(RMC._RSC['val'][da.id].head_id).querySelector('.pullDownLabel').innerHTML = '放開以更新';
								}
							}else{
								$(JID).scrollTop(mar);//alert(mar);
							}
							event.preventDefault();
						}
					}else{
						$('#'+RMC._RSC['val'][da.id].head_id).css('display','none');
					}
					//alert(RMC._RSC['val'][da.id].ssy+' -- '+RMC._RSC['val'][da.id].sy);
					//RMC._RSC['val'][da.id].distance=-(RMC._RSC['val'][da.id].ssy-RMC._RSC['val'][da.id].sy);
					//var mar=RMC._RSC['val'][da.id].tdistance+RMC._RSC['val'][da.id].distance;
					//alert(RMC._RSC['val'][da.id].distance);
					//$(JID).scrollTop(200);
					//$(JID).css('-webkit-transform',' translateY('+mar+'px)');
					//event.preventDefault();
					//event.stopPropagation();
				},
				'touchend':function(e){
					//if(RMC._RSC['val'][da.id].isload) event.preventDefault();
					//if(RMC._RSC['val'][da.id].isupdate) event.preventDefault();
					RMC._RSC['val'][da.id].now=$(this).scrollTop();//alert(RMC._RSC['val'][da.id].show+' -- '+RMC._RSC['val'][da.id].isupdate);
					if(RMC._RSC['val'][da.id].show){
						if(RMC._RSC['val'][da.id].isupdate){
							RMC._RSC['val'][da.id].show=false;
							$(JID).scrollTop(0);
							$(JID).css('-webkit-transform',' translateY(0px)');
							document.getElementById(RMC._RSC['val'][da.id].head_id).className = 'iscroller-update loading';
							document.getElementById(RMC._RSC['val'][da.id].head_id).querySelector('.pullDownLabel').innerHTML = '更新中....';
							//alert(typeof(evel(da.upfun)));
							//alert(da.upfun);
							//if(typeof(da.upfun)=='function'){
							//RMC._RSC['val'][da.id].isload=true;
							eval(da.upfun+'('+"'"+da.id+"'"+');');
							//	eval('var tmpda='+da.upfun+'();');
							//	$(JID).html(RMC._RSC['val'][da.id].head_html+tmpda);
							//}
							//$('#'+RMC._RSC['val'][da.id].head_id).css('display','none');
							
							//document.getElementById(RMC._RSC['val'][da.id].head_id).className = 'iscroller-update no';
							//document.getElementById(RMC._RSC['val'][da.id].head_id).querySelector('.pullDownLabel').innerHTML = '';
							//RMC._RSC['val'][da.id].isload=false;
							
						}else{
							RMC._RSC['val'][da.id].show=false;
							$('#'+RMC._RSC['val'][da.id].head_id).css('display','none');
							$(JID).scrollTop(0);//alert('c');
						}
					}
					//alert('tt');
					//$(JID).scrollTop(200);
					//$(JID).animate({scrollTop:2000},200);
				}
			});
			/*$(JID).on({
			    'touchend': function(e) { //event.preventDefault();
			        //alert($('#newsv').scrollTop()); // Replace this with your code.
			        setTimeout(function(){
			        	RMC._RSC['val'][da.id].now=$(JID).scrollTop();//event.preventDefault();
			        	$('#aq').html('1= '+RMC._RSC['val'][da.id].now+' -- '+RMC._RSC['val'][da.id].start_h+' -- '+RMC._RSC['val'][da.id].isupdate+' -- '+RMC._RSC['val'][da.id].swipe);
			        	if(RMC._RSC['val'][da.id].swipe=='down'){
			        		if(RMC._RSC['val'][da.id].isupdate){
			    	    		if(RMC._RSC['val'][da.id].now==RMC._RSC['val'][da.id].start_h) RMC._RSC['val'][da.id].isupdate=true;
			    	    		else if(RMC._RSC['val'][da.id].now>RMC._RSC['val'][da.id].start_h) RMC._RSC['val'][da.id].isupdate=false;
			    	    		else{
			    	    			RMC._RSC['val'][da.id].isupdate=false;
			    	    		}
			    	    		
			    	    	}else{
			    	    		$('#aq').html('2= '+RMC._RSC['val'][da.id].now+' -- '+RMC._RSC['val'][da.id].start_h+' -- '+RMC._RSC['val'][da.id].isupdate+' -- '+RMC._RSC['val'][da.id].swipe);
			    	    		if(RMC._RSC['val'][da.id].now<RMC._RSC['val'][da.id].start_h){
			    	    			//alert(JID);
			    	    			//event.stopPropagation();
			    	    			//setTimeout(function(){
			    	    				//$(JID).scrollTop(RMC._RSC['val'][da.id].start_h);
			    	    			//},200);
			    	    			document.getElementById('iii').scrollTop=60;
			    	    			$('#iii').css('-webkit-transform',' translateY(-60px)');
			    	    			setTimeout(function(){//alert('settop');
			    	    				//document.getElementById('iii').style.opacity=0.5;
			    	    				//$('#iii').click();
			    	    				document.getElementById('iii').scrollTop=60;
			    	    				//$('#iii').css('-webkit-transform',' translateY(-60px)');
			    	    				//$('#'+RMC._RSC['val'][da.id].head_id).css('display','none');
			    	    				document.getElementById('aq').innerHTML=document.getElementById('iii').scrollTop;
			    	    				//setTimeout(function(){
			    	    					$('#iii').css('-webkit-transform',' translateY(0px)');
			    	    					//$('#'+RMC._RSC['val'][da.id].head_id).css('display','');
			    	    				//});
			    	    				//document.getElementById('iii').scrollTop=60;//RMC._RSC['val'][da.id].start_h;
			    	    				//document.getElementById('iii').style.opacity=1;
			    	    			},2000);
			    	    			RMC._RSC['val'][da.id].now=RMC._RSC['val'][da.id].start_h;
			    	    			RMC._RSC['val'][da.id].isupdate=true;
			    	    			$('#aq').html('6= '+RMC._RSC['val'][da.id].now+' -- '+RMC._RSC['val'][da.id].start_h+' -- '+RMC._RSC['val'][da.id].isupdate+' -- '+RMC._RSC['val'][da.id].swipe);
			    	    			event.stopPropagation();//return false;//event.preventDefault();
			    	    		}else{
			    	    			//再執行一次
			    	    			setTimeout(function(){
			    	    				RMC._RSC['val'][da.id].now=$(JID).scrollTop();
			    	    				if(RMC._RSC['val'][da.id].isupdate){
						    	    		
						    	    	}else{
						    	    		$('#aq').html('3= '+RMC._RSC['val'][da.id].now+' -- '+RMC._RSC['val'][da.id].start_h+' -- '+RMC._RSC['val'][da.id].isupdate+' -- '+RMC._RSC['val'][da.id].swipe);
						    	    		if(RMC._RSC['val'][da.id].now<RMC._RSC['val'][da.id].start_h){
						    	    			//alert(JID);
						    	    			$(JID).scrollTop(RMC._RSC['val'][da.id].start_h);
						    	    			RMC._RSC['val'][da.id].now=RMC._RSC['val'][da.id].start_h;
						    	    			RMC._RSC['val'][da.id].isupdate=true;
						    	    			$('#aq').html('5= '+RMC._RSC['val'][da.id].now+' -- '+RMC._RSC['val'][da.id].start_h+' -- '+RMC._RSC['val'][da.id].isupdate+' -- '+RMC._RSC['val'][da.id].swipe);
						    	    			event.preventDefault();
						    	    		}
						    	    	}
			    	    			},500);
			    	    		}
			    	    	}
			        	
			        	}
			        	if(RMC._RSC['val'][da.id].swipe=='up'){
			        		RMC._RSC['val'][da.id].isupdate=false;
			        		$('#aq').html('4= '+RMC._RSC['val'][da.id].now+' -- '+RMC._RSC['val'][da.id].start_h+' -- '+RMC._RSC['val'][da.id].isupdate+' -- '+RMC._RSC['val'][da.id].swipe);
			        	}
			        	
			        	//event.preventDefault();
			        	//if(RMC._RSC['val'][da.id].start_h==RMC._RSC['val'][da.id].now) RMC._RSC['val'][da.id].isupdate=true;
			        	//else RMC._RSC['val'][da.id].isupdate=false;
			        	//alert(RMC._RSC['val'][da.id].isupdate);
			        	//event.preventDefault();
			       	},1000);//$('#nne').html($(this).scrollTop());
			        //event.preventDefault();
			    },
			    'touchstart':function(e){
			    	if (event.targetTouches.length == 1) {
			    	    var touch = event.targetTouches[0];
			    	    RMC._RSC['val'][da.id].sx=touch.pageX;
			    	    RMC._RSC['val'][da.id].sy=touch.pageY;
			    	  }
			    	RMC._RSC['val'][da.id].start=$(this).scrollTop();
			    },
			    'touchmove':function(e){
			    	RMC._RSC['val'][da.id].now=$(this).scrollTop();
			    	//event.preventDefault();
			    	if (event.targetTouches.length == 1) {
			    	    var touch = event.targetTouches[0];
			    	    // Place element where the finger is
			    	    //obj.style.left = touch.pageX + 'px';
			    	    //obj.style.top = touch.pageY + 'px';
			    	    if(touch.pageY>RMC._RSC['val'][da.id].sy) RMC._RSC['val'][da.id].swipe='down';
			    	    else RMC._RSC['val'][da.id].swipe='up';
			    	    //$('#aq').html('x='+touch.pageX+' -- y='+touch.pageY+' -- '+RMC._RSC['val'][da.id].swipe);
			    	    $('#aq').html(RMC._RSC['val'][da.id].now+' -- '+RMC._RSC['val'][da.id].start_h+' -- '+RMC._RSC['val'][da.id].swipe);
			    	  }
			    	if(RMC._RSC['val'][da.id].swipe=='down'){
		    	    	if(RMC._RSC['val'][da.id].isupdate){
		    	    		
		    	    	}else{
		    	    		$('#aq').html(RMC._RSC['val'][da.id].now+' -- '+RMC._RSC['val'][da.id].start_h);
		    	    		if(RMC._RSC['val'][da.id].now<RMC._RSC['val'][da.id].start_h){
		    	    			//$(this).scrollTop(RMC._RSC['val'][da.id].start_h);
		    	    			//$('#aq').html('x='+touch.pageX+' -- y='+touch.pageY+' -- '+RMC._RSC['val'][da.id].swipe+' -- '+RMC._RSC['val'][da.id].now);
		    	    			$('#aq').html(RMC._RSC['val'][da.id].now+' -- '+RMC._RSC['val'][da.id].start_h+' -- '+RMC._RSC['val'][da.id].swipe);
		    	    			//event.preventDefault();
		    	    		}
		    	    	}
		    	    }
			    }
			});*/
			
			/*$(JID).swipe( {
				swipeStatus:function(event, phase, direction, distance , duration , fingerCount) {
					//移動時
					if(phase=="move"){
						RMC._RSC['val'][da.id].swipe=direction;
						if(direction=='up'){
							//RMC._RSC['val'][da.id].distance=distance;
							//RMC._MAIN.swipe='left';
							//var mar=RMC._RSC['val'][da.id].tdistance-distance;
							//$(this).css('-webkit-transform',' translateY('+mar+'px)');
						}else if(direction=='down'){
							//RMC._RSC['val'][da.id].distance=distance;
							//RMC._MAIN.swipe='right';
							//var mar=RMC._RSC['val'][da.id].tdistance+distance;
							//$(this).css('-webkit-transform',' translateY('+mar+'px)');
						}
					}
					
					//結束後
					if(phase === $.fn.swipe.phases.PHASE_END || phase === $.fn.swipe.phases.PHASE_CANCEL){
					
						
						
					}
				},
				allowPageScroll:"auto",
				threshold:100
		   });*/
		},
		//更新資料
		rScrollUpdate:function(id,da){
			$('#'+id).html(RMC._RSC['val'][id].head_html+da);
			document.getElementById(id+'_ss').style.display='none';
			RMC._RSC['val'][id].show=false;
			RMC._RSC['val'][id].isupdate=false;
		},
		//取得strolltop
		getDownListTop:function(id,e){
			//新式
			//RMC._DOWNLIST.runing[id]=false;
			var vd=RMC._DOWNLIST[id]%40;//alert(RMC._DOWNLIST[id]+' -- '+vd);
			if(vd>20){
				RMC._DOWNLIST[id] +=(40-vd);
				//document.getElementById(id).scrollTop=RMC._DOWNLIST[id];//$('#'+id).scrollTop(RMC._DOWNLIST[id]);
			}else{
				RMC._DOWNLIST[id] -=vd;
				//$('#'+id).scrollTop(RMC._DOWNLIST[id]);
			}
			//event.preventDefault(); event.stopPropagation();
			//document.getElementById(id).click();
			//document.getElementById(id).scrollTop=RMC._DOWNLIST[id];

			$('#'+id).clearQueue();
			$('#'+id).animate({scrollTop:RMC._DOWNLIST[id]},200,function(){
				RMC._DOWNLIST.runing[id]=false;
				RMC._DOWNLIST.val[id]=parseInt(($('#'+id).scrollTop()+80)/40)+1;
				RMC._DOWNLIST.val[id]=$('#'+id+' > li:nth-child('+RMC._DOWNLIST.val[id]+')').html();
				//如果是日期就檢查日期
				if(RMC._DOWNLIST.usetype=='birthday'){
					if(RMC._DOWNLIST.runing['down_p1']==false && RMC._DOWNLIST.runing['down_p2']==false && RMC._DOWNLIST.runing['down_p3']==false){
						RMC.checkDownListDay();
					}
				}
			});
			//舊式
			/*var now=$('#'+id).scrollTop();
			if(RMC._DOWNLIST[id]!=now){
				RMC._DOWNLIST[id]=now;
				setTimeout('RMC.getDownListTop(\''+id+'\')',250);
			}else{
				RMC._DOWNLIST.runing=false;
				var vd=RMC._DOWNLIST[id]%30;//alert(RMC._DOWNLIST[id]+' -- '+vd);
				if(vd>15){
					RMC._DOWNLIST[id] +=(30-vd);
					//document.getElementById(id).scrollTop=RMC._DOWNLIST[id];//$('#'+id).scrollTop(RMC._DOWNLIST[id]);
				}else{
					RMC._DOWNLIST[id] -=vd;
					//$('#'+id).scrollTop(RMC._DOWNLIST[id]);
				}
				//event.preventDefault(); event.stopPropagation();
				//document.getElementById(id).click();
				document.getElementById(id).scrollTop=RMC._DOWNLIST[id];
				document.getElementById(id).preventDefault();
				//$('#'+id).animate({scrollTop:RMC._DOWNLIST[id]}, '500');
				//alert(RMC._DOWNLIST[id]);
				//event.stopPropagation();
				//event.preventDefault();
				
				
			}*/
			//RMC._DOWNLIST['down_p1']
		},
		//隱藏選單
		hideDownList:function(){
			$('#down_select').css('display','none');
		},
		//設定初始值
		setDownListInitVal:function(id,val){
			var i=0;
			$('#'+id+' > li').each(function(){
				++i;
				if($(this).html()==val){
					//取初始值
					//var tmp=parseInt(($('#'+id).scrollTop()+80)/40)+1;
					//RMC._DOWNLIST.val[id]=$('#'+id+' > li:nth-child('+tmp+')').html();
					
					i=(i-3)*40;
					$('#'+id).scrollTop(i);
					return false;
					//e.stopPropagation();
					//e.preventDefault();
				}
			});
		},
		//顯示選單
		showDownList:function(id){
			$('#down_select').css('display','');
			//取得拉霸的高度
			RMC._DOWNLIST.bottom['down_p1']=document.getElementById('down_p1').scrollHeight;
			RMC._DOWNLIST.bottom['down_p2']=document.getElementById('down_p2').scrollHeight
			RMC._DOWNLIST.bottom['down_p3']=document.getElementById('down_p3').scrollHeight
			RMC._DOWNLIST.bottom['down_p4']=document.getElementById('down_p4').scrollHeight
			RMC._DOWNLIST.bottom['down_p5']=document.getElementById('down_p5').scrollHeight
			
			var tmp='';//alert(id);
			if(id!=undefined){
				//有設值第一次執行
				switch(RMC._DOWNLIST.usetype)
				{
					case 'birthday':
						tmp=document.getElementById(id).value;
						if(tmp!=''){
							tmp=tmp.split(' ');
							if(tmp[1].substring(0,1)=='0') tmp[1]=tmp[1].substring(1,3);
							if(tmp[2].substring(0,1)=='0') tmp[2]=tmp[2].substring(1,3);
							RMC.setDownListInitVal('down_p1',tmp[0]);
							RMC.setDownListInitVal('down_p2',tmp[1]);
							RMC.setDownListInitVal('down_p3',tmp[2]);
							//alert(tmp[0]);
							//var n=$("#down_p1:contains('"+tmp[0]+"')").eq();alert($("#down_p1:contains('"+tmp[0]+"')").scrollTop());
							//var nn=n.length;alert(nn);
							//for(var i=0;i<nn;i++){
								//alert('n='+n+' = '+n[i]);
							//}
						}
						break;
					default:break;
				}
			}
			//取初始值
			tmp='';//alert(parseInt(($('#down_p1').scrollTop()+80)/40)+1);
			for(var i=1;i<=5;i++){
				if(RMC._DOWNLIST.bottom['down_p'+i]==0){
					RMC._DOWNLIST.val['down_p'+i]='';
				}else{
					tmp=parseInt(($('#down_p'+i).scrollTop()+80)/40)+1;
					RMC._DOWNLIST.val['down_p'+i]=$('#down_p'+i+' > li:nth-child('+tmp+')').html();
				}
			}
			//setTimeout(function(){
				//RMC._DOWNLIST.sltop[0]=document.getElementById('down_p1').scrollHeight-document.getElementById('down_p1').offsetHeight;
				//alert($('#down_p1').height()+' -- '+$('#down_p1').prop('scrollHeight')+' -- '+$('#down_p1')[0].scrollHeight+' -- '+document.getElementById('down_p1').scrollHeight+' -- '+document.getElementById('down_p1').offsetHeight);
			//},500);
			
			//alert(RMC._DOWNLIST.bottom['down_p1']);
		},
		createDownList:function(){
			if(document.getElementById('down_select')){
				var xv=0;
				xv=RMC._SH-250;
				document.getElementById('down_select').innerHTML='<div class="panel" style="top:'+xv+'px;"><div class="up"></div><div class="down"></div><div class="sel"></div><div class="hd"><a href="javascript:RMC.hideDownList();"><span class="canbtn">取消</span></a><a href="javascript:RMC.getDownListValue();"><span class="btn">確定</span></a></div><div class="bar p20" id="cp1"><ul id="down_p1"><li>asd1</li><li>asd2</li><li>asd3</li><li>asd4</li><li>asd5</li><li>asd6</li><li>asd7</li><li>asd5</li><li>asd6</li><li>asd7</li></ul></div><div class="bar p20" id="cp2"><ul id="down_p2"><li>ccc</li></ul></div><div class="bar p20" id="cp3"><ul id="down_p3"><li>ccc</li></ul></div><div class="bar p20" id="cp4"><ul id="down_p4"><li>ccc</li></ul></div><div class="bar p20" id="cp5"><ul id="down_p5"><li>ccc</li></ul></div></div>';
				$('#down_select').css({'width':RMC._SW+'px','height':RMC._SH+'px'});
				RMC._DOWNLIST={'setid':'','hiddenid':'','time':0,'runing':{'down_p1':false,'down_p2':false,'down_p3':false,'down_p4':false,'down_p5':false},'val':{'down_p1':'','down_p2':'','down_p3':'','down_p4':'','down_p5':''},'number':0,'usetype':'','usey':0,'usey_prev':0,'finish_id':'','bottom':{'down_p1':0,'down_p2':0,'down_p3':0,'down_p4':0,'down_p5':0},'down_p1':0,'down_p2':0,'down_p3':0,'down_p4':0,'down_p5':0};
				//$('#down_select').html('<div class="panel" style="top:'+xv+'px;"><div class="hd"></div><div id="down_p1" class="bar p50"><ul><li>asd1</li><li>asd2</li><li>asd3</li><li>asd4</li><li>asd5</li><li>asd6</li><li>asd7</li><li>asd5</li><li>asd6</li><li>asd7</li></ul></div></div>');
				//$('#down_select').on({'touchmove':function(e){alert(event.targetTouches.length);}});
				/*$('#down_select').on({
					'touchstart':function(e){
						alert('c');
						e.stopPropagation();
					}
				});*/
				$('#down_select').swipe({
					tap:function(){
						RMC.hideDownList();
					},threshold:50	
				});
				$('#down_p1').on({
					'touchstart':function(e){
						RMC._DOWNLIST.runing[this.id]=true;
						//if(RMC._DOWNLIST.runing[this.id]) e.stopPropagation();
						//e.preventDefault();
						//alert(event.targetTouches.length);
						if (event.targetTouches.length > 0) {
				    	    var touch = event.targetTouches[0];
				    	    RMC._DOWNLIST.usey=touch.pageY;
				    	    RMC._DOWNLIST.usey_prev=0;
						}
					},
					'touchmove':function(e){
						//if(RMC._DOWNLIST.runing) e.stopPropagation();
						//alert(event.targetTouches.length);
						if (event.targetTouches.length > 0) {
				    	    var touch = event.targetTouches[0];
				    	    RMC._DOWNLIST.usey_prev=RMC._DOWNLIST.usey;
				    	    RMC._DOWNLIST.usey=touch.pageY;
				    	    //alert(RMC._DOWNLIST.usey_prev+' - - '+RMC._DOWNLIST.usey);
				    	    
				    	    var v=RMC._DOWNLIST.usey-RMC._DOWNLIST.usey_prev;
				    	    if(RMC._DOWNLIST.usey_prev>0){
				    	    	var now=$('#'+this.id).scrollTop();//$('#xcx').html(now);
				    	    	now +=-v;
				    	    	$('#'+this.id).scrollTop(now);
				    	    }
				    	    //var d = new Date();
				    	    //RMC._DOWNLIST.time = d.getTime();
						}
						e.preventDefault();
					},
					'touchend':function(e){
						//RMC._DOWNLIST.runing=true;
						//alert(RMC._DOWNLIST.usey_prev+' - - '+RMC._DOWNLIST.usey);
						/*if (event.targetTouches.length == 1) {alert('c');
				    	    var touch = event.targetTouches[0];
				    	    alert(touch.pageY);
				    	    alert(touch.pageY-RMC._DOWNLIST.usey);
						}*/
						//$(this).animate({scrollTop:300},200);
						//
						if(RMC._DOWNLIST.usey_prev>0){
							var d = new Date();
							var x = d.getTime()-RMC._DOWNLIST.time;
							//$('#xtx').html(x);
					    	//alert(d.getTime()-RMC._DOWNLIST.time);
							//RMC._DOWNLIST.time = d.getTime();
							//alert(d.getTime);
					    	RMC._DOWNLIST[this.id]=$(this).scrollTop();
							var v=RMC._DOWNLIST.usey-RMC._DOWNLIST.usey_prev;
							k=Math.abs(v);
							if ( ( k /= 1 ) < ( 1 / 2.75 ) ) {
								k= 7.5625 * k * k;
							} else if ( k < ( 2 / 2.75 ) ) {
								k= 7.5625 * ( k -= ( 1.5 / 2.75 ) ) * k + 0.75;
							} else if ( k < ( 2.5 / 2.75 ) ) {
								k= 7.5625 * ( k -= ( 2.25 / 2.75 ) ) * k + 0.9375;
							} else {
								k= 7.5625 * ( k -= ( 2.625 / 2.75 ) ) * k + 0.984375;
							}
							//k=7.5625 * k * k;
							if(v<0){
								k=RMC._DOWNLIST[this.id]+k;
								if(k>RMC._DOWNLIST.bottom[this.id]) k=RMC._DOWNLIST[this.id];
							}else{
								k=RMC._DOWNLIST[this.id]-k;
								if(k<0) k=0;
								
							}
							RMC._DOWNLIST[this.id]=k;
							//alert(k+' -- '+v);
							v=this.id;
							//x=x*100;
							//if(x>600) x=600;
							$(this).clearQueue();
							$(this).animate({scrollTop:k},600,function(){
								RMC.getDownListTop(v);
							});
						}else{
							
						}
						e.preventDefault();
						
						/*var v=this.id;
						setTimeout(function(){
							RMC.getDownListTop(v);
						},250);*/
						//e.preventDefault();
						//e.preventDefault();
						//e.stopPropagation();
					}
				});
				$('#down_p2').on({
					'touchstart':function(e){
						/*$('#dp2').html(new Date().getTime());
						if(RMC._DOWNLIST.runing['down_p2']) {
							$('#dp1').html('b1');
							setTimeout(function(){
								RMC._DOWNLIST.runing['down_p2']=false;
								$('#dp1').html('xvv');
							},3000);
							e.stopPropagation();
							//e.preventDefault();
							
						}*/
						RMC._DOWNLIST.runing[this.id]=true;
						if (event.targetTouches.length >0) {
				    	    var touch = event.targetTouches[0];
				    	    RMC._DOWNLIST.usey=touch.pageY;
				    	    RMC._DOWNLIST.usey_prev=0;
						}
					},
					'touchmove':function(e){
						/*$('#dp3').html('b22-'+RMC._DOWNLIST.usey_prev);
						if(RMC._DOWNLIST.runing[this.id]) {
							//e.stopPropagation();
							$('#dp3').html('b2');
						}*/
						if (event.targetTouches.length >0) {
				    	    var touch = event.targetTouches[0];
				    	    RMC._DOWNLIST.usey_prev=RMC._DOWNLIST.usey;
				    	    RMC._DOWNLIST.usey=touch.pageY;

				    	    var v=RMC._DOWNLIST.usey-RMC._DOWNLIST.usey_prev;
				    	    if(RMC._DOWNLIST.usey_prev>0){
				    	    	var now=$('#'+this.id).scrollTop();//$('#xcx').html(now);
				    	    	now +=-v;
				    	    	$('#'+this.id).scrollTop(now);
				    	    }
						}
						e.preventDefault();
					},
					'touchend':function(e){
						
						/*if(RMC._DOWNLIST.runing[this.id]) {
						//e.stopPropagation();
						$('#dp3').html('b3');
					}*/
						//RMC._DOWNLIST.runing[this.id]=true;

						if(RMC._DOWNLIST.usey_prev>0){
					    	RMC._DOWNLIST[this.id]=$(this).scrollTop();
							var v=RMC._DOWNLIST.usey-RMC._DOWNLIST.usey_prev;
							k=Math.abs(v);
							if ( ( k /= 1 ) < ( 1 / 2.75 ) ) {
								k= 7.5625 * k * k;
							} else if ( k < ( 2 / 2.75 ) ) {
								k= 7.5625 * ( k -= ( 1.5 / 2.75 ) ) * k + 0.75;
							} else if ( k < ( 2.5 / 2.75 ) ) {
								k= 7.5625 * ( k -= ( 2.25 / 2.75 ) ) * k + 0.9375;
							} else {
								k= 7.5625 * ( k -= ( 2.625 / 2.75 ) ) * k + 0.984375;
							}
							//k=7.5625 * k * k;
							if(v<0){
								k=RMC._DOWNLIST[this.id]+k;
								if(k>RMC._DOWNLIST.bottom[this.id]) k=RMC._DOWNLIST[this.id];
							}else{
								k=RMC._DOWNLIST[this.id]-k;
								if(k<0) k=0;
								
							}//$('#dp3').html('b33 -- '+k);
							RMC._DOWNLIST[this.id]=k;
							//alert(k+' -- '+v);
							v=this.id;
							$(this).clearQueue();
							$(this).animate({scrollTop:k},600,function(){//$('#dp3').html('b33animte');
								RMC.getDownListTop(v);
							});
						}else{
							
						}
						e.preventDefault();
					}
				});
				$('#down_p3').on({
					'touchstart':function(e){
						//if(RMC._DOWNLIST.runing[this.id]) e.stopPropagation();
						RMC._DOWNLIST.runing[this.id]=true;
						if (event.targetTouches.length >0) {
				    	    var touch = event.targetTouches[0];
				    	    RMC._DOWNLIST.usey=touch.pageY;
				    	    RMC._DOWNLIST.usey_prev=0;
						}
					},
					'touchmove':function(e){

						if (event.targetTouches.length >0) {
				    	    var touch = event.targetTouches[0];
				    	    RMC._DOWNLIST.usey_prev=RMC._DOWNLIST.usey;
				    	    RMC._DOWNLIST.usey=touch.pageY;

				    	    var v=RMC._DOWNLIST.usey-RMC._DOWNLIST.usey_prev;
				    	    if(RMC._DOWNLIST.usey_prev>0){
				    	    	var now=$('#'+this.id).scrollTop();//$('#xcx').html(now);
				    	    	now +=-v;
				    	    	$('#'+this.id).scrollTop(now);
				    	    }
						}
						e.preventDefault();
					},
					'touchend':function(e){
						//RMC._DOWNLIST.runing=true;

						if(RMC._DOWNLIST.usey_prev>0){
					    	RMC._DOWNLIST[this.id]=$(this).scrollTop();
							var v=RMC._DOWNLIST.usey-RMC._DOWNLIST.usey_prev;
							k=Math.abs(v);
							if ( ( k /= 1 ) < ( 1 / 2.75 ) ) {
								k= 7.5625 * k * k;
							} else if ( k < ( 2 / 2.75 ) ) {
								k= 7.5625 * ( k -= ( 1.5 / 2.75 ) ) * k + 0.75;
							} else if ( k < ( 2.5 / 2.75 ) ) {
								k= 7.5625 * ( k -= ( 2.25 / 2.75 ) ) * k + 0.9375;
							} else {
								k= 7.5625 * ( k -= ( 2.625 / 2.75 ) ) * k + 0.984375;
							}
							//k=7.5625 * k * k;
							if(v<0){
								k=RMC._DOWNLIST[this.id]+k;
								if(k>RMC._DOWNLIST.bottom[this.id]) k=RMC._DOWNLIST[this.id];
							}else{
								k=RMC._DOWNLIST[this.id]-k;
								if(k<0) k=0;
								
							}
							RMC._DOWNLIST[this.id]=k;
							//alert(k+' -- '+v);
							v=this.id;
							$(this).clearQueue();
							$(this).animate({scrollTop:k},600,function(){
								RMC.getDownListTop(v);
							});
						}else{
							
						}
						e.preventDefault();
					}
				});
				$('#down_p4').on({
					'touchstart':function(e){
						//if(RMC._DOWNLIST.runing[this.id]) e.stopPropagation();
						RMC._DOWNLIST.runing[this.id]=true;
						if (event.targetTouches.length >0) {
				    	    var touch = event.targetTouches[0];
				    	    RMC._DOWNLIST.usey=touch.pageY;
				    	    RMC._DOWNLIST.usey_prev=0;
						}
					},
					'touchmove':function(e){

						if (event.targetTouches.length >0) {
				    	    var touch = event.targetTouches[0];
				    	    RMC._DOWNLIST.usey_prev=RMC._DOWNLIST.usey;
				    	    RMC._DOWNLIST.usey=touch.pageY;

				    	    var v=RMC._DOWNLIST.usey-RMC._DOWNLIST.usey_prev;
				    	    if(RMC._DOWNLIST.usey_prev>0){
				    	    	var now=$('#'+this.id).scrollTop();//$('#xcx').html(now);
				    	    	now +=-v;
				    	    	$('#'+this.id).scrollTop(now);
				    	    }
						}
						e.preventDefault();
					},
					'touchend':function(e){
						//RMC._DOWNLIST.runing[this.id]=true;

						if(RMC._DOWNLIST.usey_prev>0){
					    	RMC._DOWNLIST[this.id]=$(this).scrollTop();
							var v=RMC._DOWNLIST.usey-RMC._DOWNLIST.usey_prev;
							k=Math.abs(v);
							if ( ( k /= 1 ) < ( 1 / 2.75 ) ) {
								k= 7.5625 * k * k;
							} else if ( k < ( 2 / 2.75 ) ) {
								k= 7.5625 * ( k -= ( 1.5 / 2.75 ) ) * k + 0.75;
							} else if ( k < ( 2.5 / 2.75 ) ) {
								k= 7.5625 * ( k -= ( 2.25 / 2.75 ) ) * k + 0.9375;
							} else {
								k= 7.5625 * ( k -= ( 2.625 / 2.75 ) ) * k + 0.984375;
							}
							//k=7.5625 * k * k;
							if(v<0){
								k=RMC._DOWNLIST[this.id]+k;
								if(k>RMC._DOWNLIST.bottom[this.id]) k=RMC._DOWNLIST[this.id];
							}else{
								k=RMC._DOWNLIST[this.id]-k;
								if(k<0) k=0;
								
							}
							RMC._DOWNLIST[this.id]=k;
							//alert(k+' -- '+v);
							v=this.id;
							$(this).clearQueue();
							$(this).animate({scrollTop:k},600,function(){
								RMC.getDownListTop(v);
							});
						}else{
							
						}
						e.preventDefault();
					}
				});
				$('#down_p5').on({
					'touchstart':function(e){
						//if(RMC._DOWNLIST.runing[this.id]) e.stopPropagation();
						RMC._DOWNLIST.runing[this.id]=true;
						if (event.targetTouches.length >0) {
				    	    var touch = event.targetTouches[0];
				    	    RMC._DOWNLIST.usey=touch.pageY;
				    	    RMC._DOWNLIST.usey_prev=0;
						}
					},
					'touchmove':function(e){

						if (event.targetTouches.length >0) {
				    	    var touch = event.targetTouches[0];
				    	    RMC._DOWNLIST.usey_prev=RMC._DOWNLIST.usey;
				    	    RMC._DOWNLIST.usey=touch.pageY;

				    	    var v=RMC._DOWNLIST.usey-RMC._DOWNLIST.usey_prev;
				    	    if(RMC._DOWNLIST.usey_prev>0){
				    	    	var now=$('#'+this.id).scrollTop();//$('#xcx').html(now);
				    	    	now +=-v;
				    	    	$('#'+this.id).scrollTop(now);
				    	    }
						}
						e.preventDefault();
					},
					'touchend':function(e){
						//RMC._DOWNLIST.runing=true;

						if(RMC._DOWNLIST.usey_prev>0){
					    	RMC._DOWNLIST[this.id]=$(this).scrollTop();
							var v=RMC._DOWNLIST.usey-RMC._DOWNLIST.usey_prev;
							k=Math.abs(v);
							if ( ( k /= 1 ) < ( 1 / 2.75 ) ) {
								k= 7.5625 * k * k;
							} else if ( k < ( 2 / 2.75 ) ) {
								k= 7.5625 * ( k -= ( 1.5 / 2.75 ) ) * k + 0.75;
							} else if ( k < ( 2.5 / 2.75 ) ) {
								k= 7.5625 * ( k -= ( 2.25 / 2.75 ) ) * k + 0.9375;
							} else {
								k= 7.5625 * ( k -= ( 2.625 / 2.75 ) ) * k + 0.984375;
							}
							//k=7.5625 * k * k;
							if(v<0){
								k=RMC._DOWNLIST[this.id]+k;
								if(k>RMC._DOWNLIST.bottom[this.id]) k=RMC._DOWNLIST[this.id];
							}else{
								k=RMC._DOWNLIST[this.id]-k;
								if(k<0) k=0;
								
							}
							RMC._DOWNLIST[this.id]=k;
							//alert(k+' -- '+v);
							v=this.id;
							$(this).clearQueue();
							$(this).animate({scrollTop:k},600,function(){
								RMC.getDownListTop(v);
							});
						}else{
							
						}
						e.preventDefault();
					}
				});
			}
		},
		//設定開始
		setDownList:function(da,id){
			RMC._DOWNLIST.usetype=da.type;
			if(da.hidden!=undefined){
				RMC._DOWNLIST.hiddenid=da.hidden;
			}else RMC._DOWNLIST.hiddenid='';
			//與上次設定一定就不再設定
			if(RMC._DOWNLIST.setid==id){//alert(id);
				RMC.showDownList(id);
			}else{//alert('c1');
				RMC._DOWNLIST.setid=id;
				//新的設定
				switch(da.type)
				{
					case 'birthday'://生日
						var today=new Date();
						//document.write("今天日期是 " + Today.getFullYear()+ " 年 " + (Today.getMonth()+1) + " 月 " + Today.getDate() + " 日");
						var ey=today.getFullYear();
						var sy=ey-99;
						$('#down_select .bar').css('display','none');
						//設定年
						var tmp='<li></li><li></li>';
						for(var i=sy;i<=ey;i++){
							tmp +='<li>'+i+'年</li>';
						}
						tmp +='<li></li><li></li>';
						var doc=document.getElementById('down_p1');
						var docup=document.getElementById('cp1');
						doc.innerHTML=tmp;
						docup.className='bar p40';
						docup.style.display='';
						//設定月
						tmp='<li></li><li></li>';
						for(var i=1;i<=12;i++){
							tmp +='<li>'+i+'月</li>';
						}
						tmp +='<li></li><li></li>';
						doc=document.getElementById('down_p2');
						docup=document.getElementById('cp2');
						doc.innerHTML=tmp;
						docup.className='bar p30';
						docup.style.display='';
						//設定日
						tmp='<li></li><li></li>';
						for(var i=1;i<=31;i++){
							tmp +='<li>'+i+'日</li>';
						}
						tmp +='<li></li><li></li>';
						doc=document.getElementById('down_p3');
						docup=document.getElementById('cp3');
						doc.innerHTML=tmp;
						docup.className='bar p30';
						docup.style.display='';
						
						RMC.showDownList(id);
						break;
					case 'set_val'://自定資料
						for(var i=1;i<=5;i++){
							document.getElementById('cp'+i).style.display='none';
						}
						
						var st={'v1':'p1','v2':'p2','v3':'p3','v4':'p4','v5':'p5'};
						var tmp='';
						if(da.per!=undefined){
							for(var k in st){
								tmp='';
								if(da[k]!=undefined){//da.v1 ...
									var m=da[k].length;
									tmp='<li></li><li></li>';
									if(da['attr_'+k]==undefined){//da.attr_v1 ....
										for(var i=0;i<m;i++){
											tmp +='<li>'+da[k][i]+'</li>';
										}
									}else{
										for(var i=0;i<m;i++){
											tmp +='<li re="'+da['attr_'+k][i]+'">'+da[k][i]+'</li>';
										}
									}
									tmp +='<li></li><li></li>';
									var doc=document.getElementById('down_'+st[k]);//down_p1
									var docup=document.getElementById('c'+st[k]);//cp1
									doc.innerHTML=tmp;
									docup.className='bar p'+da.per[k];//da.per.v1 ....p40
									docup.style.display='';
									
								}
							}
							
							RMC.showDownList(id);
						}
						break;
					default:
						break;
				}
			}
		},
		//取得資料
		getDownListValue:function(){
			//取資料
			if(!RMC._DOWNLIST.runing['down_p1'] && !RMC._DOWNLIST.runing['down_p2'] && !RMC._DOWNLIST.runing['down_p3'] && !RMC._DOWNLIST.runing['down_p4'] && !RMC._DOWNLIST.runing['down_p5']){
				//alert('start');
				//var p1=(($('#down_p1').scrollTop()+80)/40)+1;alert('p1='+p1);
				//p1=$('#down_p1 > li:nth-child('+p1+')').html();
				//var p2,p3,p4,p5,val;
				var val;
				switch(RMC._DOWNLIST.usetype)
				{
					case 'birthday'://生日
						//p2=(($('#down_p2').scrollTop()+80)/40)+1;alert('p2='+p2);
						//p2=$('#down_p2 > li:nth-child('+p2+')').html();
						//p3=(($('#down_p3').scrollTop()+80)/40)+1;alert('p3='+p3);
						//p3=$('#down_p3 > li:nth-child('+p3+')').html();
						//val=p1+'-'+p2+'-'+p3;
						val=RMC._DOWNLIST.val['down_p1']+' '+RMC._DOWNLIST.val['down_p2']+' '+RMC._DOWNLIST.val['down_p3'];
						//alert(val);
						break;
					case 'set_val':
						var p;
						var tmp=[];
						var tmp2=[];
						for(var i=1;i<=5;i++){//alert(document.getElementById('cp'+i).style.display);
							if(document.getElementById('cp'+i).style.display!='none'){
								tmp.push(RMC._DOWNLIST.val['down_p'+i]);
								if(RMC._DOWNLIST.hiddenid!=''){
									p=(($('#down_p'+i).scrollTop()+80)/40)+1;
									p=$('#down_p'+i+' > li:nth-child('+p+')').attr('re');
									tmp2.push(p);
								}
							}
							
						}
						if(RMC._DOWNLIST.hiddenid!=''){
							tmp2=tmp2.join(' ');
							$('#'+RMC._DOWNLIST.hiddenid).val(tmp2);//alert(RMC._DOWNLIST.hiddenid+' -- '+tmp2);
						}
						val=tmp.join(' ');
						break;
					default:
						val='';
						break;
				}
				//alert(RMC._DOWNLIST.setid);
				$('#'+RMC._DOWNLIST.setid).val(val);
			}
			
			RMC.hideDownList();//關閉
		},
		//檢查日期是否正確
		checkDownListDay:function(){
			
			
			
			//alert(RMC._DOWNLIST.val['down_p1']+RMC._DOWNLIST.val['down_p2']+RMC._DOWNLIST.val['down_p3']);
			
			//var p1=parseInt(($('#down_p1').scrollTop()+80)/40)+1;
			//p1=$('#down_p1 > li:nth-child('+p1+')').html();
			//var p2=parseInt(($('#down_p2').scrollTop()+80)/40)+1;
			//p2=$('#down_p2 > li:nth-child('+p2+')').html();
			//var p3=parseInt(($('#down_p3').scrollTop()+80)/40)+1;
			//p3=$('#down_p3 > li:nth-child('+p3+')').html();
			//p1=p1.ReplaceAll('年');
			//p2=p2.ReplaceAll('月');
			//p3=p3.ReplaceAll('日');
			var p1=RMC._DOWNLIST.val['down_p1'].ReplaceAll('年');
			var p2=RMC._DOWNLIST.val['down_p2'].ReplaceAll('月');
			var p3=RMC._DOWNLIST.val['down_p3'].ReplaceAll('日');
			p1=parseInt(p1);
			p2=parseInt(p2);
			p3=parseInt(p3);
			//檢查是否大於今日
			if(RMC._DOWNLIST.usetype=='birthday'){
				var d=new Date();
				var dy=d.getFullYear();
				var dm=d.getMonth()+1;
				var dd=d.getDate();
				if(p1>dy || (p1==dy && p2>dm) || (p1==dy && p2==dm && p3>dd)){

					RMC._DOWNLIST.val['down_p3']=dd+'日';
					RMC._DOWNLIST.val['down_p2']=dm+'月';
					p2=40*(dm-1);
					p3=40*(dd-1);
					$('#down_p2').clearQueue();
					$("#down_p2").animate({scrollTop:p2},200);
					$('#down_p3').clearQueue();
					$("#down_p3").animate({scrollTop:p3},200);
					return false;
				}
			}
			//檢查日期是否正確
			if(p2==2){
				if(p1%4==0){//alert('p2 29');
					if(p3>29) {
						$("#down_p3").animate({scrollTop:1120},200);
						RMC._DOWNLIST.val['down_p3']='29日';
					}
				}else{//alert('p2 28');
					if(p3>28) {
						$("#down_p3").animate({scrollTop:1080},200);
						RMC._DOWNLIST.val['down_p3']='28日';
					}
				}
			}else if(p2==4 || p2==6 || p2==9 || p2==11){
				if(p3==31){
					$("#down_p3").animate({scrollTop:1160},200);
					RMC._DOWNLIST.val['down_p3']='30日';
				}
			}
		},
		//驗證
		ckTips:function(data,da){
			var mydata=data.split(",");
			var m=mydata.length;
			var ckd=1;
			var msg='';
			var ckstr=true;
			var uta,i,j,k;
			var myeid;
			
			for(i=0,j=1,k=2;i<m;i=i+3,j=j+3,k=k+3){
				uta="錯誤或未填寫";

				switch(mydata[j])
				{
					case 'email'://檢查email
						if(da[mydata[i]]!=''){
				    		re = new RegExp(/^(([0-9a-zA-Z_.]+)|([0-9a-zA-Z]+[_.0-9a-zA-Z-]*[0-9a-zA-Z_.]+))@([a-zA-Z0-9-]+[.])+([a-zA-Z]{2}|net|NET|com|COM|gov|GOV|mil|MIL|org|ORG|edu|EDU|int|INT|biz|BIZ|idv|IDV|cc|CC)$/);
		                	ckstr=re.test(da[mydata[i]]);
				    	}else{
				    		ckstr=false;
				    		uta='未填寫';
				    	}
						break;
					case 'emails'://檢查email
						if(da[mydata[i]]!=''){
				    		re = new RegExp(/^(([0-9a-zA-Z_.]+)|([0-9a-zA-Z]+[_.0-9a-zA-Z-]*[0-9a-zA-Z_.]+))@([a-zA-Z0-9-]+[.])+([a-zA-Z]{2}|net|NET|com|COM|gov|GOV|mil|MIL|org|ORG|edu|EDU|int|INT|biz|BIZ|idv|IDV|cc|CC)$/);
		                	ckstr=re.test(da[mydata[i]]);
				    	}else{
				    		ckstr=true;
				    		//uta='未填寫';
				    	}
						break;
					case 'acc'://檢查帳號
						if(da[mydata[i]]!=''){
							re=new RegExp(/^[a-zA-Z][0-9a-zA-Z_-]{2,}$/);
							ckstr=re.test(da[mydata[i]]);
						}else{
							ckstr=false;
							uta='未填寫';
						}
						break;
					case 'accs'://檢查帳號
						if(da[mydata[i]]!=''){
							re=new RegExp(/^[a-zA-Z][0-9a-zA-Z_-]{2,}$/);
							ckstr=re.test(da[mydata[i]]);
						}else{
							ckstr=true;
						}
						break;
					case 'num':
						if(trim(da[mydata[i]])==''){
							ckstr=false;
							uta='未填寫';
						}else{
							if(isNaN(da[mydata[i]])){
								ckstr=false;
								uta='不是數字';
							}
						}
						break;
					case 'nums':
						if(isNaN(da[mydata[i]])){
							ckstr=false;
							uta='不是數字';
						}
						break;
					case 'radio'://檢查選項
						if(da[mydata[i]]==undefined || da[mydata[i]]==''){
							ckstr=false;
							uta='未選擇';
						}
						break;
					case 'pwd'://密碼
						var inp=mydata[i].split('|');
						if(da[inp[0]]==''){
							ckstr=false;
							uta='未輸入';
						}else if(da[inp[1]]==''){
							ckstr=false;
							uta='確認未輸入';
						}else if(da[inp[0]]!=da[inp[1]]){
							ckstr=false;
							uta='二次的密碼不一樣';
						}else{
							
						}
						break;
					case 'selectone'://至少輸入一個
						inp=mydata[i].split('|');
						var mx=inp.length;
						ckstr=false;
						for(var mi=0;mi<mx;mi++){
							if(da[inp[mi]]!='') {
								ckstr=true;
								break;
							}
						}
						if(!ckstr){
							//inp=mydata[k].ReplaceAll('\|','、');alert(inp);
							//inp=mydata[k].split('|');
							//inp=inp.join('、');
							//uta=inp+' 至少填寫一個';
							uta=' 至少填寫一個';
						}
						break;
					default:
						if(da[mydata[i]]==''){
		            		ckstr=false;
		            		uta='未填寫';
		            	}
						break;
				}

				if(!ckstr){
		            msg=msg+mydata[k]+uta;
				    ckd=0;
			        break;
				}
			}

			if(msg!=''){
				RMC.alert(msg,'資料填寫錯誤','確定');
				RMC.hidePageLoad();
			}
			
			return ckd;
		},
		searchToEmpty:function(id){
			document.getElementById(id).value='';
		},
		//取消設定val
		valToEmpty:function(da){
			var m=da.length;
			for(var i=0;i<m;i++){
				document.getElementById(da[i]).value='';
			}
		},
		//取消設定html
		htmlToEmpty:function(da){
			var m=da.length;
			for(var i=0;i<m;i++){
				document.getElementById(da[i]).innerHTML='';
			}
		},
		clearConInput:function(id){
			$('#'+id+' input[type=text]').val('');
			$('#'+id+' input[type=hidden]').val('');
		},
		//還原刪除後狀態
		backDelStatus:function(id,type,hideid)
		{
			switch(type)
			{
				case 'list2':
					var d=$('#'+id+' .list2').eq(0).css('margin-left');
					if(d=='60px'){
						$('#'+id+' .list2').animate({'margin-left':'0px'},500);
						$('#'+id+' .del').animate({'left':'-60px'},500);
					}
					break;
				default:
					var d=$('#'+id+' .list').eq(0).css('margin-left');
					if(d=='60px'){
						$('#'+id+' .list').animate({'margin-left':'0px'},500);
						$('#'+id+' .del').animate({'left':'-60px'},500);
					}
					break;
			}
			if(hideid!=undefined){
				$('#'+hideid).css({'opacity':0,'pointer-events':'none'});
				//hideitem(hideid);//要確定是否有hideitem
			}

		},
		//加入滑動事件
		add_scroll_event:function(id,ev){
			//_PAGEMOVE:{'runing':{},'bottom':{},'usey':0,'usey_prev':0},//頁面滑動事件
			if(!document.getElementById('rscroll_img')){
				$('body').prepend('<div class="iscroller-start-div" id="rscroll_img" style="width:'+RMC._SW+'px;height:0px;top:0px;left:0px;display:none;"><div id="rscroll_up" class="iscroller-update" ><span class="pullDownIcon"></span><span class="pullDownLabel"></span></div></div>');
			}
			RMC._PAGEMOVE.runing[id]=false;
			//eventbottom
			if(ev.bottom!=undefined){
				RMC._PAGEMOVE.eventbottom[id]=ev.bottom;
			}
			if(ev.top!=undefined){
				RMC._PAGEMOVE.eventtop[id]=ev.top;
				//$('#'+id).css('position','static');
				//$('#'+id).prepend('<div class="iscroller-start-div" id="xxcx"><div class="iscroller-update" ><span class="pullDownIcon"></span><span class="pullDownLabel"></span></div></div>');
				//alert($('#'+id).html());
			}
			
			
			//取得初始scroll高
			RMC._PAGEMOVE.bottom[id]=(document.getElementById(id).scrollHeight-document.getElementById(id).offsetHeight);//document.getElementById(id).scrollHeight;
			RMC._PAGEMOVE.loadpage[id]=0;
			RMC._PAGEMOVE.searchkey[id]='';
			RMC._PAGEMOVE.more[id]=false;
			RMC._PAGEMOVE.mx[id]=0;
			RMC._PAGEMOVE.sid[id]='#'+id;
			RMC._PAGEMOVE.inittop[id]=document.getElementById(id).getBoundingClientRect().top;
			
			$('#'+id).on({
				'touchstart':function(e){
					RMC._PAGEMOVE.runing[this.id]=true;
					
					if(RMC._PAGEMOVE.inittop[this.id]<=0) RMC._PAGEMOVE.inittop[this.id]=document.getElementById(this.id).getBoundingClientRect().top;
					RMC._PAGEMOVE.bottom[this.id]=(document.getElementById(id).scrollHeight-document.getElementById(this.id).offsetHeight);
					$('#rscroll_img').css({'top':RMC._PAGEMOVE.inittop[this.id]+'px','height':'0px'});
					//if(RMC._DOWNLIST.runing[this.id]) e.stopPropagation();
					
					if (event.targetTouches.length >0) {
			    	    var touch = event.targetTouches[0];
			    	    RMC._PAGEMOVE.usey=touch.pageY;
			    	    RMC._PAGEMOVE.usey_prev=0;
					}
				},
				'touchmove':function(e){

					if (event.targetTouches.length >0) {
			    	    var touch = event.targetTouches[0];
			    	    RMC._PAGEMOVE.usey_prev=RMC._PAGEMOVE.usey;
			    	    RMC._PAGEMOVE.usey=touch.pageY;

			    	    var v=RMC._PAGEMOVE.usey-RMC._PAGEMOVE.usey_prev;
			    	    if(RMC._PAGEMOVE.usey_prev>0){
			    	    	var now=$('#'+this.id).scrollTop();//$('#xcx').html(now);
			    	    	now +=-v;
			    	    	
			    	    	
			    	    	if(RMC._PAGEMOVE.eventtop[this.id]!=undefined){
				    	    	if(now<0){
				    	    		now=-now;
				    	    		RMC._PAGEMOVE.mx[id] +=now;
				    	    		$(RMC._PAGEMOVE.sid[id]).scrollTop(0);
				    	    		$(RMC._PAGEMOVE.sid[id]).css('-webkit-transform',' translateY('+RMC._PAGEMOVE.mx[id] +'px)');
				    	    		//$(RMC._PAGEMOVE.sid[id]).css('margin-top',RMC._PAGEMOVE.mx[id] +'px');
				    	    		if(RMC._PAGEMOVE.mx[id]<60){
				    	    			$('#rscroll_img').css({'top':RMC._PAGEMOVE.inittop[this.id]+'px','height':RMC._PAGEMOVE.mx[id]+'px','overflow':'hidden','display':'block'});
				    	    		}else{
				    	    			var top=RMC._PAGEMOVE.mx[id]-60+RMC._PAGEMOVE.inittop[id];
				    	    			$('#rscroll_img').css({'top':top+'px','height':'60px','display':'block'});
				    	    		}
				    	    		//alert('cc');
				    	    	}else{
				    	    		if(RMC._PAGEMOVE.mx[id]>0){
				    	    			now -=RMC._PAGEMOVE.mx[id] ;
				    	    			if(now<0){
				    	    				now=-now;
				    	    				RMC._PAGEMOVE.mx[id]=now;
				    	    				now=0;
				    	    				if(RMC._PAGEMOVE.mx[id]<60){
						    	    			$('#rscroll_img').css({'top':RMC._PAGEMOVE.inittop[this.id]+'px','display':'block','height':RMC._PAGEMOVE.mx[id]+'px','overflow':'hidden'});
						    	    			
				    	    				}else{
						    	    			var top=RMC._PAGEMOVE.mx[id]-60+RMC._PAGEMOVE.inittop[id];
						    	    			$('#rscroll_img').css({'top':top+'px','display':'block','height':'60px'});
						    	    			
						    	    		}
				    	    				if(RMC._PAGEMOVE.mx[id]<80){
				    	    					document.getElementById('rscroll_up').className = 'iscroller-update start';
						    	    			document.getElementById('rscroll_up').querySelector('.pullDownLabel').innerHTML = '下拉以更新';
				    	    				}else{
				    	    					document.getElementById('rscroll_up').className = 'iscroller-update flip';
						    	    			document.getElementById('rscroll_up').querySelector('.pullDownLabel').innerHTML = '放開以更新';
				    	    				}
				    	    			}else{
				    	    				RMC._PAGEMOVE.mx[id]=0;
				    	    				
				    	    			}
				    	    			$(RMC._PAGEMOVE.sid[id]).scrollTop(now);
			    	    				$(RMC._PAGEMOVE.sid[id]).css('-webkit-transform',' translateY('+RMC._PAGEMOVE.mx[id] +'px)');
				    	    			//$(RMC._PAGEMOVE.sid[id]).css('margin-top',RMC._PAGEMOVE.mx[id] +'px');
				    	    		}else{
				    	    			$('#rscroll_img').css({'display':'none'});
				    	    			$(RMC._PAGEMOVE.sid[id]).scrollTop(now);
				    	    		}
				    	    	}
			    	    	}else{
			    	    		//沒有設定top
			    	    		$('#'+this.id).scrollTop(now);
			    	    	}
			    	    	
			    	    	//if(now<0){
			    	    		//$('#class_live_head_name').html(now);
			    	    		//now=-now;//alert(now);
			    	    		//$('#'+this.id).css('-webkit-transform',' translateY(60px)');
			    	    		//$('#'+this.id).css('padding-top',now+'px').scrollTop(0);
			    	    	//}else  $('#'+this.id).scrollTop(now);
			    	    }
					}
					e.preventDefault();
				},
				'touchend':function(e){
					//RMC._DOWNLIST.runing=true;
					if(RMC._PAGEMOVE.usey_prev>0){
				    	RMC._PAGEMOVE.nowtop[this.id]=$(this).scrollTop();
				    	
				    	if(RMC._PAGEMOVE.nowtop[this.id]==0){
				    		if(RMC._PAGEMOVE.eventtop[this.id]!=undefined){
								
								if(RMC._PAGEMOVE.mx[id]>0){
									RMC._PAGEMOVE.mx[id]=0;
									$(RMC._PAGEMOVE.sid[id]).css({'-webkit-transition':'transform 1s','-webkit-transform':' translateY(0px)'});
									//$('#rscroll_img').clearQueue();
									//$('#rscroll_img').animate({top:'-80px'},1000);
									$('#rscroll_img').css({'top':'0px','display':'none'});
									
									if(RMC._PAGEMOVE.mx[id]>80){
										v=this.id;
										eval(RMC._PAGEMOVE.eventtop[v]+'(\''+v+'\');');
									}
								}
								//v=this.id;
								//if(k==0){
									//eval(RMC._PAGEMOVE.eventtop[v]+'(\''+v+'\');');
								//}
							}
				    	}else{
							var v=RMC._PAGEMOVE.usey-RMC._PAGEMOVE.usey_prev;
							k=Math.abs(v);
							if ( ( k /= 1 ) < ( 1 / 2.75 ) ) {
								k= 7.5625 * k * k;
							} else if ( k < ( 2 / 2.75 ) ) {
								k= 7.5625 * ( k -= ( 1.5 / 2.75 ) ) * k + 0.75;
							} else if ( k < ( 2.5 / 2.75 ) ) {
								k= 7.5625 * ( k -= ( 2.25 / 2.75 ) ) * k + 0.9375;
							} else {
								k= 7.5625 * ( k -= ( 2.625 / 2.75 ) ) * k + 0.984375;
							}
							//k=7.5625 * k * k;
							if(v<0){
								k=RMC._PAGEMOVE.nowtop[this.id]+k;
								if(k>RMC._PAGEMOVE.bottom[this.id]) k=RMC._PAGEMOVE.bottom[this.id];
							}else{
								k=RMC._PAGEMOVE.nowtop[this.id]-k;
								if(k<0) k=0;
								
							}
							RMC._PAGEMOVE.nowtop[this.id]=k;
							//document.getElementById('class_live_head_name').innerHTML=RMC._PAGEMOVE.bottom[this.id];
							//document.getElementById('class_live_head_name').innerHTML=(document.getElementById(id).scrollHeight-document.getElementById(id).offsetHeight);
							//alert(k+' -- '+v);
							v=this.id;
							$(this).clearQueue();
							$(this).animate({scrollTop:k},600,function(){
								//RMC.getDownListTop(v);
								//RMC.checkPageMoveEnd(v);
								//alert(RMC._PAGEMOVE.eventbottom[v]);
								if(RMC._PAGEMOVE.eventbottom[v]!=undefined){
									if(RMC._PAGEMOVE.bottom[v]<=k){
										eval(RMC._PAGEMOVE.eventbottom[v]+'(\''+v+'\','+k+');');
									}
								}							
								
								
								//alert(document.getElementById('xxcx').getBoundingClientRect().top);
								//$('#xxcx').css('top','-60px').animate({'top':'0px'},5000);
								//document.getElementById('xxcx').getBoundingClientRect().top
								//document.getElementById('class_live_head_name').innerHTML=document.getElementById(v).getBoundingClientRect().top+' -- '+RMC._PAGEMOVE.inittop[v];
								
							});
						}
					}else{
						
					}
					e.preventDefault();
				}
			});
		},
		//滑動資料更新bottom
		updatePageMove:function(id,nums,key){
			//var name='#'+id+' .content';
			//RMC._PAGEMOVE.bottom[id]=$(name)[0].scrollHeight;//$(name).scrollTop($(name)[0].scrollHeight);
			RMC._PAGEMOVE.bottom[id]=(document.getElementById(id).scrollHeight-document.getElementById(id).offsetHeight);//document.getElementById(id).scrollHeight;
			RMC._PAGEMOVE.loadpage[id]=nums;
			if(key==undefined) key='';
			RMC._PAGEMOVE.searchkey[id]=key;
		}
		/*,
		//驗證
		ckTip:function(data){
			RMC.setPageLoad();
			var mydata=data.split(",");
			var m=mydata.length;
			var ckd=1;
			var re='';
			var msg='';
			var ckstr=true;
			var uta='';
			var eid='';
			var myeid='';
			var i,j,k;
			for(i=0,j=1,k=2;i<m;i=i+3,j=j+3,k=k+3)
		    {
				uta='錯誤或未填寫';
				switch(mydata[j]){
				    case 'mail'://email
				    	if(document.getElementById(mydata[i]).value!=''){
				    		re = new RegExp(/^(([0-9a-zA-Z_.]+)|([0-9a-zA-Z]+[_.0-9a-zA-Z-]*[0-9a-zA-Z_.]+))@([a-zA-Z0-9-]+[.])+([a-zA-Z]{2}|net|NET|com|COM|gov|GOV|mil|MIL|org|ORG|edu|EDU|int|INT|biz|BIZ|idv|IDV|cc|CC)$/);
		                	ckstr=re.test(document.getElementById(mydata[i]).value);
				    	}else{
				    		ckstr=false;
				    		uta='未填寫';
				    	}
		                break;
		            default:
		            	if(document.getElementById(mydata[i]).value==''){
		            		ckstr=false;
		            		uta='未填寫';
		            	}
		            	break;
				}
				
				if(!ckstr){
					if(myeid=='') eid=mydata[i].split('|')[0];
		    		else eid=myeid;
		            msg=msg+mydata[k]+uta;
				    ckd=0;
			        break;
				}
		    }
			
			
			if(msg!=''){
				RMC.alert(msg,'資料填寫錯誤','確定');
				RMC.hidePageLoad();
			}
			
			return ckd;
		}*/
};
//cordova 參數 window.onload=function(){SomeJavaScriptCode}; document.addEventListener("DOMContentLoaded", onloadHandler, false); 
$(document).ready(function(){
	RMC.create();
	if(RMC._TMP!=''){
		(RMC._TMP)();
	}
	//$("img.lazy").lazy();//圖片預載
	//jQuery("img.lazy").lazy();
	//$("img.lazy").lazyload();
});
