/*
 *　儲存page 的 input 的資料 
 * 
 */
var INP={
		_HMTM:'',//收的資料html
		_SETWH:{},//設定寬高
		_LOADHTML:{},//讀取的html
		//清除資料
		clears:function(id){
			$('#'+id+' .content').html('');
		},
		//清除id資料
		clearsId:function(id){
			$('#'+id).html('');
		},
		//密碼編修
		editPwdPage:function(){
			this._HMTM='<div align="left" class="linput" style="margin-top:20px;">'+
				'<span class="left-title">新密碼</span>'+
				'<span class="right-title" style="width:'+this._SETWH['right-title']+'px"><input type="password" placeholder="你新的密碼" id="xpwd" class="inp" /></span>'+
				'</div>'+
				'<div align="left" class="linput" >'+
				'<span class="left-title">確認密碼</span>'+
				'<span class="right-title" style="width:'+this._SETWH['right-title']+'px"><input type="password" placeholder="再次輸入新密碼" id="xckpwd" class="inp" /></span>'+
				'</div>';
			
			return this._HMTM;
		},
		//學生新增
		studentAddPage:function(){
			this._HMTM='<div style="padding:5px 10px 0px 10px;">選擇班級</div>'+
				'<div align="left" class="linput"><input type="hidden" id="st_class_id" /><input type="hidden" id="student_id" value="" />'+
				'<span class="left-title">班級名稱</span>'+
				'<span class="right-title" style="width:'+this._SETWH['right-title']+'px"><input type="text" placeholder="選擇班級" id="st_class_name" class="inp" onclick="set_class_select()" readonly /></span>'+
				'</div>'+
				'<div style="padding:5px 10px 0px 10px;">設定帳密</div>'+
				'<div class="linput-tip ">不輸入時，系統會自動給于該名學生流水帳號</div>'+
				'<div align="left" class="linput">'+
				'<span class="left-title">帳號</span>'+
				'<span class="right-title" style="width:'+this._SETWH['right-title']+'px"><input type="text" placeholder="只能輸入英文字數" id="st_acc" class="inp" /></span>'+
				'</div>'+
				'<div align="left" class="linput">'+
				'<span class="left-title">密碼</span>'+
				'<span class="right-title" style="width:'+this._SETWH['right-title']+'px"><input type="password" placeholder="請輸入密碼" id="st_pwd" class="inp" /></span>'+
				'</div>'+
				'<div style="padding:5px 10px 0px 10px;">學生資料</div>'+
				'<div align="left" class="linput"><input type="hidden" id="st_id" value="" />'+
				'<span class="left-title">姓名</span>'+
				'<span class="right-title" style="width:'+this._SETWH['right-title']+'px"><input type="text" placeholder="真實姓名" id="st_name" class="inp"/></span>'+
				'</div>'+
				'<div align="left" class="linput">'+
				'<span class="left-title">生日</span>'+
				'<span class="right-title" style="width:'+this._SETWH['right-title']+'px"><input type="text" placeholder="生日" id="st_birthday" class="inp" onclick="show_birthday(\'st_birthday\');" readonly /></span>'+
				'</div>'+
				'<div align="left" class="linput">'+
				'<span class="left-title">電話</span>'+
				'<span class="right-title" style="width:'+this._SETWH['right-title']+'px"><input type="text" placeholder="手機或電話號碼" id="st_tel"  class="inp"/></span>'+
				'</div>'+
				'<div align="left" class="linput">'+
				'<span class="left-title">身高</span>'+
				'<span class="right-title" style="width:'+this._SETWH['right-title']+'px"><input type="number" id="st_height"  class="inp" placeholder="幾公分" maxlength="3" /></span>'+
				'</div>'+
				'<div align="left" class="linput">'+
				'<span class="left-title">體重</span>'+
				'<span class="right-title" style="width:'+this._SETWH['right-title']+'px"><input type="number" id="st_weight"  class="inp" placeholder="幾公斤" maxlength="3" /></span>'+
				'</div>'+
				'<div align="left" class="linput">'+
				'<span class="left-title">血型</span>'+
				'<span class="right-title" style="width:'+this._SETWH['right-title']+'px">'+
				'<span class="radio" id="st_blood">'+
				'<input type="radio" value="A" id="st_blood1" name="st_blood" /><label for="st_blood1">A</label><input type="radio" value="B" id="st_blood2"  name="st_blood" /><label for="st_blood2">B</label><input type="radio" value="O" id="st_blood3"  name="st_blood" /><label for="st_blood3">O</label><input type="radio" value="AB" id="st_blood4" name="st_blood" /><label for="st_blood4">AB</label>'+
				'</span>'+
				'</span>'+
				'</div>'+
				'<div align="left" class="linput">'+
				'<span class="left-title">地址</span>'+
				'<span class="right-title" style="width:'+this._SETWH['right-title']+'px"><input type="text" id="st_addr"  class="inp" placeholder="您的住家地址" /></span>'+
				'</div>'+
				'<div align="left" class="linput">'+
				'<span class="left-title">信箱</span>'+
				'<span class="right-title" style="width:'+this._SETWH['right-title']+'px"><input type="text" placeholder="您的信箱" id="st_email"  class="inp"/></span>'+
				'</div>'+
				'<div style="padding:5px 10px 0px 10px;">緊急聯絡人</div>'+
				'<div align="left" class="linput">'+
				'<span class="left-title">聯絡人姓名</span>'+
				'<span class="right-title" style="width:'+this._SETWH['right-title']+'px"><input type="text" placeholder="聯絡人姓名" id="st_contact1" class="inp" /></span>'+
				'</div>'+
				'<div align="left" class="linput" >'+
				'<span class="left-title">電話</span>'+
				'<span class="right-title" style="width:'+this._SETWH['right-title']+'px"><input type="text" placeholder="聯絡人電話" id="st_tel1" class="inp" /></span>'+
				'</div>'+
				'<div align="left" class="linput" >'+
				'<span class="left-title">稱謂</span>'+
				'<span class="right-title" style="width:'+this._SETWH['right-title']+'px"><input type="text" placeholder="與聯絡人關係" id="st_title1" class="inp" /></span>'+
				'</div>'+
				'<div align="left" class="linput" >'+
				'<span class="left-title">聯絡人姓名</span>'+
				'<span class="right-title" style="width:'+this._SETWH['right-title']+'px"><input type="text" placeholder="聯絡姓名" id="st_contact2" class="inp" /></span>'+
				'</div>'+
				'<div align="left" class="linput" >'+
				'<span class="left-title">電話</span>'+
				'<span class="right-title" style="width:'+this._SETWH['right-title']+'px"><input type="text" placeholder="聯絡人電話" id="st_tel2" class="inp" /></span>'+
				'</div>'+
				'<div align="left" class="linput" >'+
				'<span class="left-title">稱謂</span>'+
				'<span class="right-title" style="width:'+this._SETWH['right-title']+'px"><input type="text" placeholder="與聯絡人關係" id="st_title2" class="inp" /></span>'+
				'</div>';
				
				return this._HMTM;
		},
		//讀取檔案有換頁
		loadPageFile:function(file,id,pageid){
			if(INP._LOADHTML[file]==undefined){
				$.get(file,function(data){
					data=data.ReplaceAll('right-title"','right-title" style="width:'+INP._SETWH['right-title']+'px"');
					INP._LOADHTML[file]=data;
					$('#'+id).html(data);
					if(pageid!=undefined) RMC.changepage(pageid);
				});
			}else{
				$('#'+id).html(INP._LOADHTML[file]);
				if(pageid!=undefined) RMC.changepage(pageid);
			}
		},
		//學生編輯
		studentEditPage:function(){
			this._HMTM='<div style="padding:5px 10px 0px 10px;">選擇班級</div>'+
			'<div align="left" class="linput"><input type="hidden" id="st_class_id" /><input type="hidden" id="student_id" value="" />'+
			'<span class="left-title">班級名稱</span>'+
			'<span class="right-title" style="width:'+this._SETWH['right-title']+'px"><input type="text" placeholder="選擇班級" id="st_class_name" class="inp" onclick="set_class_select()" readonly /></span>'+
			'</div>'+
			'<div style="padding:5px 10px 0px 10px;">設定帳密</div>'+
			'<div class="linput-tip ">不輸入時，系統會自動給于該名學生流水帳號</div>'+
			'<div align="left" class="linput">'+
			'<span class="left-title">帳號</span>'+
			'<span class="right-title" style="width:'+this._SETWH['right-title']+'px"><input type="text" placeholder="只能輸入英文字數" id="st_acc" class="inp" /></span>'+
			'</div>'+
			'<div align="left" class="linput">'+
			'<span class="left-title">密碼</span>'+
			'<span class="right-title" style="width:'+this._SETWH['right-title']+'px"><input type="password" placeholder="請輸入密碼" id="st_pwd" class="inp" /></span>'+
			'</div>'+
			'<div style="padding:5px 10px 0px 10px;">學生資料</div>'+
			'<div align="left" class="linput"><input type="hidden" id="st_id" value="" />'+
			'<span class="left-title">姓名</span>'+
			'<span class="right-title" style="width:'+this._SETWH['right-title']+'px"><input type="text" placeholder="真實姓名" id="st_name" class="inp"/></span>'+
			'</div>'+
			'<div align="left" class="linput">'+
			'<span class="left-title">生日</span>'+
			'<span class="right-title" style="width:'+this._SETWH['right-title']+'px"><input type="text" placeholder="生日" id="st_birthday" class="inp" onclick="show_birthday(\'st_birthday\');" readonly /></span>'+
			'</div>'+
			'<div align="left" class="linput">'+
			'<span class="left-title">電話</span>'+
			'<span class="right-title" style="width:'+this._SETWH['right-title']+'px"><input type="text" placeholder="手機或電話號碼" id="st_tel"  class="inp"/></span>'+
			'</div>'+
			'<div align="left" class="linput">'+
			'<span class="left-title">身高</span>'+
			'<span class="right-title" style="width:'+this._SETWH['right-title']+'px"><input type="number" id="st_height"  class="inp" placeholder="幾公分" /></span>'+
			'</div>'+
			'<div align="left" class="linput">'+
			'<span class="left-title">體重</span>'+
			'<span class="right-title" style="width:'+this._SETWH['right-title']+'px"><input type="number" id="st_weight"  class="inp" placeholder="幾公斤" /></span>'+
			'</div>'+
			'<div align="left" class="linput">'+
			'<span class="left-title">血型</span>'+
			'<span class="right-title" style="width:'+this._SETWH['right-title']+'px">'+
			'<span class="radio" id="st_blood">'+
			'<input type="radio" value="A" id="st_blood1" name="st_blood" /><label for="st_blood1">A</label><input type="radio" value="B" id="st_blood2"  name="st_blood" /><label for="st_blood2">B</label><input type="radio" value="O" id="st_blood3"  name="st_blood" /><label for="st_blood3">O</label><input type="radio" value="AB" id="st_blood4" name="st_blood" /><label for="st_blood4">AB</label>'+
			'</span>'+
			'</span>'+
			'</div>'+
			'<div align="left" class="linput">'+
			'<span class="left-title">地址</span>'+
			'<span class="right-title" style="width:'+this._SETWH['right-title']+'px"><input type="text" id="st_addr"  class="inp" placeholder="您的住家地址" /></span>'+
			'</div>'+
			'<div align="left" class="linput">'+
			'<span class="left-title">信箱</span>'+
			'<span class="right-title" style="width:'+this._SETWH['right-title']+'px"><input type="text" placeholder="您的信箱" id="st_email"  class="inp"/></span>'+
			'</div>'+
			'<div style="padding:5px 10px 0px 10px;">緊急聯絡人</div>'+
			'<div align="left" class="linput">'+
			'<span class="left-title">聯絡人姓名</span>'+
			'<span class="right-title" style="width:'+this._SETWH['right-title']+'px"><input type="text" placeholder="聯絡人姓名" id="st_contact1" class="inp" /></span>'+
			'</div>'+
			'<div align="left" class="linput" >'+
			'<span class="left-title">電話</span>'+
			'<span class="right-title" style="width:'+this._SETWH['right-title']+'px"><input type="text" placeholder="聯絡人電話" id="st_tel1" class="inp" /></span>'+
			'</div>'+
			'<div align="left" class="linput" >'+
			'<span class="left-title">稱謂</span>'+
			'<span class="right-title" style="width:'+this._SETWH['right-title']+'px"><input type="text" placeholder="與聯絡人關係" id="st_title1" class="inp" /></span>'+
			'</div>'+
			'<div align="left" class="linput" >'+
			'<span class="left-title">聯絡人姓名</span>'+
			'<span class="right-title" style="width:'+this._SETWH['right-title']+'px"><input type="text" placeholder="聯絡姓名" id="st_contact2" class="inp" /></span>'+
			'</div>'+
			'<div align="left" class="linput" >'+
			'<span class="left-title">電話</span>'+
			'<span class="right-title" style="width:'+this._SETWH['right-title']+'px"><input type="text" placeholder="聯絡人電話" id="st_tel2" class="inp" /></span>'+
			'</div>'+
			'<div align="left" class="linput" >'+
			'<span class="left-title">稱謂</span>'+
			'<span class="right-title" style="width:'+this._SETWH['right-title']+'px"><input type="text" placeholder="與聯絡人關係" id="st_title2" class="inp" /></span>'+
			'</div>';
			
			return this._HMTM;
		}
};