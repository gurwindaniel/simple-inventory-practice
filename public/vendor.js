$(document).ready(function(){

    // Page load element redering
    $('#vendorid').prop('disabled',true)
const fetchVendor=()=>{
    const vendor={}
    vendor.vendor_name=$("#vendor_nameid").val()
    vendor.city=$('#cityid').val()
    vendor.province=$('#provinceid').val()
    vendor.country=$('#countryid').val()
    vendor.contact=$('#contactid').val()
    return vendor
}

const vendor_message=(message)=>{
    if($("#message2").children().length<1)
    {
        parent_msg=$("#message2")
    child_msg=$("<h5>").text(message)
    child_msg.css("color","red")
    parent_msg.append(child_msg)
   
    setTimeout(()=>{
        $("#message2").empty()
    },1000)
    }
    
}
//After event
const empty_input=()=>{
    $('input').val('')
}

$('#vendorsave').on('click',function(){
    const vendor_obj=fetchVendor()
   $.ajax({
    url:'/vendorpost',
    type:'json',
    method:'post',
    data:vendor_obj,
    success:function(data){
        empty_input()
        vendor_message("Vendor Created Successfuly!")
    }
   })

})


})