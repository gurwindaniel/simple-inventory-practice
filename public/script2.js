$(document).ready(function(){

    $("#closecust").on('click',function(){
        $("#cust").attr('action','/custpost')  
        $("#cust").attr('method','post')
    })

    $.ajax({
        url:'/cust',
        method:'get',
        type:'json',
        success:function(data){
            //data table

            var table=$('#datatable').DataTable({
                data:data,
                columns:[
                    {'data':'customer_id','title':'Customer ID'},
                    {'data':'customer_name','title':'Customer Name'},
                    {'data':'age','title':'Age'},
                    {'data':'email','title':'Email'}
                ],
                'columnDefs':[{
                   "targets":0,
                   "className":"dt-body-center",
                   "render":function(data,type,full,data){

                    return '<input type="checkbox" id="'+data+'" name="customer_id" class="checktable" value="'+data+'"/>'

                   },
                   "orderable":false

                }]

            })//data table ends

           table.on('click','tbody tr td:nth-child(n+2)',function(){
            
            $('input').css('border','none')
            //modal body edit
            const edit =$("#edit")
            edit.append($('<h5></h5>').text("edit"))
            
            //edit form handling
            $("#cust").attr('action','/custpatch')
            $("#cust").attr('method','patch')

            edit.on('click',function(){
                $('input').css('border','1px solid black')
                $('#custsave').on('click',function(){
                    
                    $.ajax({
                        url:`/custpatch:${id}`
                    })

                })

            })
            

            const data=table.row(this).data()
            $('#exampleModal').modal('toggle')
            get_data(data.customer_name,data.age,data.email)
           })

           //CHECK BOX AND VALUE SELECTION
           const arr=[]
           table.on('click','.checktable',function(){
            
            const row=$(this).closest('tr')
            const rowData=table.row(row).data()
            // console.log(rowData)
            const checkbox=$(this)
            const delete_container=$("#buttonContainer")
            
            if(checkbox.is(":checked"))
            {
                 arr.push(rowData.customer_id)
                if(delete_container.children().length<1)
                {
                    const deletebutton=$('<button></button>').text('Delete').addClass('btn btn-danger')
                    delete_container.append(deletebutton)

                    //Delete Event
                    delete_container.on('click',function(){
                       
                        if(arr.length==1){
                            $.ajax({
                                url:`/custdelete:${arr[0]}`,
                                method:'delete'
                            })
                        }else{
                            $.ajax({
                                url:`/custdelete:${arr}`,
                                method:'delete'
                            })
                        }
                    })
                    
                }
                
            }else if(!delete_container.prop("checked"))
            {
                const arr_index=arr.indexOf(rowData.customer_id)
               const removed_item= arr.splice(arr_index,1)
               console.log(removed_item)
               console.log(arr)
                if(arr.length==0){
                    delete_container.empty()
                }
                
            }
            

           })

        }
    })

    const fetchdata=()=>{
        const customer={}
       customer.customer_name= $("#customerid").val()
       customer.age=$("#ageid").val()
       customer.email=$("#emailid").val()
       return customer
    }

    const get_data=(customer,age,email)=>{
       
        $('#customerid').val(customer)
      $('#ageid').val(age)
        $('#emailid').val(email)

        return customer
    }

  $('#custsave').on('click',function(){
   const data=fetchdata()
   $.ajax({
    url:'/custpost',
    method:'post',
    type:'json',
    data:data,
    success:function(value){
       
    }
   })

  })
    
})