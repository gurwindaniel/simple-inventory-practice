$(document).ready(function(){

    
    //close refresh
    const close=()=>{
     
            $('input').val('')
    
    
    }

    const message=(message)=>{
        if($("#message").children().length<1)
        {
            parent_msg=$("#message")
        child_msg=$("<h5>").text(message)
        child_msg.css("color","red")
        parent_msg.append(child_msg)
       
        setTimeout(()=>{
            $("#message").empty()
        },1000)
        }
        
    }
   
    $.ajax({
        url:'/cust',
        method:'get',
        type:'json',
        success:function(data){
            
            //data table construction
            var table =$("#datatable").DataTable({
                data:data,
                columns:[
                    {'data':'customer_id','title': 'Customer ID'},
                    {'data':'customer_name', 'title': 'Customer Name'},
                    {'data':'age','title':'Age'},
                    {'data':'email','title':'Email'}
                ],
                'columnDefs': [

                    {
                        "targets": 0,
                        "className": 'dt-body-center',
                        "render": function (data, type, full, meta) {

                            return '<input type="checkbox" id="'+data+'" class="checkid" name="customer_id" value="'+data+'">';
                           

                        },
                        "orderable":false

                    }],
                    "order":[[1,'asc']],
                    "paging": true,
                    "searching": true,
                    "info": false
                
            })//closing data table

            table.on('click','tbody tr td:nth-child(n+2)',function(){
               var data=table.row(this).data()
               $('#exampleModal').modal('toggle')
              get_data(data.customer_name,data.age,data.email)
            })//click n+1 table

            // selecting checkbox event
            const arr=[10000]
            table.on('click','.checkid',function(){
               
                var row = $(this).closest('tr');
               
        // Get the data in the row
        var rowData = table.row(row).data();    
        console.log(rowData)
        console.log(arr)
        //Creating delete button when selected row
              if( $(this).is(':checked')){
                arr.push(rowData.customer_id)
               
                if($('#buttonContainer').children().length<1)
                {
                    var deleteButton=$("<button></button>").text("Delete").addClass('btn btn-danger')
                    table.$('tr.selected').removeClass('selected');
                    row.addClass('selected');
                    $('#buttonContainer').append(deleteButton);
                    $('#buttonContainer').on('click',function(e){
                       if(arr.length==2)
                       {
                        $.ajax({
                            url:`/custdelete:${arr[0]}`,
                            method:'delete'
                        })
                       }
                       else{
                        $.ajax({
                            url:`/custdelete:${arr}`,
                         method:'delete'
                        })
                        
                       }
                    })
                
                }
                
               }
               else if(!$('#buttonContainer').prop('checked')){
                
                indexToRemove=arr.indexOf(parseInt($(this).val()))
               removed_value =arr.splice(indexToRemove,1)

             
              row.removeClass('selected');
               console.log(`index ${indexToRemove} removed value ${removed_value}`)
               console.log(arr)
               if(arr.length==1){
                $('#buttonContainer').empty()
               }
              
               }
             else{
                //to do
              }
                
            })

        }
    })

    const inputFetch=()=>{
        const customer={}
        customer.customer_name=$('#customernameid').val()
        customer.age=$('#ageid').val()
        customer.email=$('#emailid').val()

        return customer
    }

    const get_data=(customer,age,email)=>{
       
        $('#customernameid').val(customer)
      $('#ageid').val(age)
        $('#emailid').val(email)

        return customer
    }

    $('#custsave').on('click',function(e){

        const value=inputFetch()
        close()
        
        $.ajax({
            url:'/custpost',
            method:'post',
            type:'json',
            data:value,
            success:function(){
                message("Form submitted")
                close()
            }
        })
       
    })

})