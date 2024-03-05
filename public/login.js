$(document).ready(function(){

    const login_val=()=>{
        const login={}
        login.email=$('#emailuserid').val()
        login.password=$('#passwordid').val()
        return login
    }

   $('#postuser').on('click',function(e){
    const login_value=login_val()
    $.ajax({
        url:'/loginpost',
        type:'json',
        method:'post',
        data:login_value,
        success:function(val){
            console.log(val)
        }
    })

   })
})