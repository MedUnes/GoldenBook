var like,unlike,remove;
$("document").ready(function(){
	like =function(message_id){
		$.ajax({
			url:"/likes",
			method:"post",
			data:{message_id: message_id},
			xhrFields: {withCredentials: true}, 
			success:(data)=>{
				window.location.href='/';
			},
			error:(xhr,status,err)=>{
				console.log(xhr.statusText)
			}
		});
	};
unlike =function(message_id){
		$.ajax({
			url:"/likes",
			method:"delete",
			data:{message_id: message_id},
			xhrFields: {withCredentials: true}, 
			success:(data)=>{
				window.location.href='/';
			},
			error:(xhr,status,err)=>{
				console.log(xhr.statusText)
			}
		});
	};
	remove =function(message_id){
		$.ajax({
			url:"/message",
			method:"delete",
			data:{message_id: message_id},
			xhrFields: {withCredentials: true}, 
			success:(data)=>{
				window.location.href='/';
			},
			error:(xhr,status,err)=>{
				console.log(xhr.statusText)
			}
		});
	};
	$("#update-profile").click(function(){
		$('.ui.basic.modal').modal('show');
		setTimeout(function(){ $(form).submit() }, 1500 );  
	});

	$("[name='photo']").change(function() {

		if (this.files && this.files[0]) {
			var reader = new FileReader();
			reader.onload = function(e) {
				$('#profile-image').attr('src', e.target.result);
			}

			reader.readAsDataURL(this.files[0]);
		}
	});

	$("#remove-image").on("click",function(){
		var $el = $("[name='photo']");
		$el.wrap('<form>').closest('form').get(0).reset();
		$el.unwrap();
		$('#profile-image').attr('src','');
	});
});