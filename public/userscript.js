$(document).ready(function(){

    //Loading users

    $.ajax({
        url:'/loaduser',
        method:'get',
        type:'json',
        success:function(data){
            console.log(data)
            //user table
            var user_table=$('#user_datatable').DataTable({
                data:data,
                columns:[
                    {'data':'user_id','title':'USER ID'},
                    {'data':'name','title':'Name'},
                    {'data':'email','title':'Email'},
                    {'data':'role_name','title':'Role'}
                    
                ]
            })
            //user table end
        
        }
    })

    $('#userid').prop('disabled',true)
    
    const userinput=()=>{
        users={}
        users.name=$('#nameid').val()
        users.email=$('#emailuserid').val()
        users.role_name=$('#role_nameid').val()
        users.password=$('#passwordid').val()
        return users
    }
//Save User Details (Form Submission)

$('#usersave').on('click',function(e){

    const data=userinput()    
    const regx=/^([a-z\d-]+)@([a-z\d]+)\.([a-z]{2,8})$/gm
    if(data.name =='' || data.email == '' || data.password=='')
    {
        alert("All Fields required")
        
    }
    else if(!regx.test(data.email))
    {
        alert('Email has to "example.com"')
    }
    else{
        $.ajax({
            url:'/userpost',
            method:'post',
            type:'json',
            data:data,
            success:function(value){
                if(value=="Invalid")
                {
                    alert('Email Already Exist')
                }else{
                    alert("User Created")
                }
            }
        })
       
    }

    
})

})