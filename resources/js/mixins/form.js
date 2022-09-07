export default {
    data() {
        return {
            form: {
                disabled: false,
                error: false,
                validations: [],
                message: null,
            },
            innerVisible:false,
        }
    },
    methods: {

        onChangeEventToggleHandler(event, action,id) {
            jQuery('#loading-div').css('display','block');
            axios.post(action, {
                id: id,
                status: event.value
            }).then(response => {

                this.$notify({
                    title: 'عملية ناجحة',
                    message: response.data.msg,
                    type: 'success',
                    position: 'bottom-left',
                    offset: 50
                });
                this.refreshTable();
                jQuery('#loading-div').css('display','none');
            }).catch(error => {
                console.log('Faild to change');
                jQuery('#loading-div').css('display','none');
            });
        },

        changeStatus(action,id, status,refreshTable) {
            jQuery('#loading-div').css('display','block');

            axios.post(action, {
                id: id,
                status: status
            }).then(res => {
                if(refreshTable){
                    this.refreshTable();
                }
                this.$notify({
                    title: 'Success',
                    message: "Status changed successfully",
                    type: 'success',
                    position: 'bottom-right',
                    offset: 50
                });
                if(status=="preparing"){
                    swal({
                        title: "Hint ! Order moved  ",
                        text: "Your order moved to orders management list",
                        type: "success",
                        timer: 4000,
                        showConfirmButton: true
                    });
                }
                jQuery('#loading-div').css('display','none');
            }).catch(res=>{
                jQuery('#loading-div').css('display','none');
            });
        },
        deleteAction(action,row_id,refreshTable) {

            swal({
                    title: 'هل تريد بالفعل حذف العنصر المحدد؟ ',
                    text: "",
                    type: "warning",
                    direction:'rtl',
                    iconHtml: '؟',
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "نعم ، قم بالحذف",
                    cancelButtonText: 'إلغاء الأمر',
                    closeOnConfirm: true,
                    closeOnCancel: true,
                },
                (e) => {
                    if (e) {
                        jQuery('#loading-div').css('display','block');
                        axios.delete(action+ row_id).then(response => {
                            // this.getAllServices();
                            // this.services.splice(this.services.indexOf(service), 1);
                            if(refreshTable){
                                this.refreshTable();
                            }

                            swal({
                                title: response.data.message,
                                text: "",
                                type: "success",
                                timer: 2000,
                                showConfirmButton: false
                            });
                            jQuery('#loading-div').css('display','none');

                        }).catch(error => {
                            console.log(row_id);
                            console.log(error);
                            console.log('test5');
                            swal({
                                title: 'Fail to delete  ',
                                text: "",
                                type: "error",
                                timer: 2000,
                                showConfirmButton: false
                            });
                            jQuery('#loading-div').css('display','none');
                        });
                    }
                }
            );
        },
        saveForm($data) {
            jQuery('#loading-div').css('display','block');
            this.form.disabled = true;
            axios({
                method: this.saveAction.type,
                url: this.saveAction.link,
                data: $data
            }).then(response => {

                swal({
                    title: response.data.message,
                    text: "",
                    type: "success",
                    timer: 2000,
                    showConfirmButton: false
                });
                setTimeout(()=>{
                    if(this.redirectPath !== null) {
                        // location.href = this.redirectPath;
                        window.location=this.redirectPath;
                    }
                    else {
                        this.form.disabled = false;
                    }
                }, 2000);
                if(this.returnValue){
                    return true;
                }
                jQuery('#loading-div').css('display','none');
            }).catch(error => {
                this.form.disabled = false;
                this.form.error = true;
                if(error.response.data.errors){
                    this.form.message = 'يوجد بيانات غير مدخلة';
                    this.form.validations = error.response.data.errors;
                }else if(error.response.data.message) {
                    this.form.validations = [];
                    this.form.message = error.response.data.message;
                }
                document.body.scrollTop = 0; // For Chrome, Safari and Opera
                document.documentElement.scrollTop = 0; // For IE and Firefox
                jQuery('#loading-div').css('display','none');
            });
        },
        //select image
        onFileChange(e,target) {
            var files = e.target.files || e.dataTransfer.files;
            if (!files.length)
                return;
            this.createImage(files[0],target);
        },
        createImage(file,target) {
            // var image = new Image();
            var reader = new FileReader();
            // var reader2 = new FileReader();
            var vm = this;

            reader.onload = (e) => {
                console.log(target);
                switch (target) {
                    case 'logo':
                        vm.shop_logo = e.target.result;
                        break;
                    case 'cover':
                        vm.shop_cover = e.target.result;
                        break;

                    case 'meal_image':
                        vm.meal_image = e.target.result;
                        break;
                    case 'vehicle_pic':
                        vm.vehicle_pic = e.target.result;
                        break;

                    case 'license_pic':
                        vm.license_pic = e.target.result;
                    break;

                    case 'id_pic':
                        vm.id_pic = e.target.result;
                    break;

                    case 'user_avatar':
                        vm.user_avatar = e.target.result;
                    break;
                    case 'warranty_pic':
                        vm.warranty_pic = e.target.result;
                        break;
                        case 'insurance_pic':
                                vm.insurance_pic = e.target.result;
                        break;


                }


            };
            reader.readAsDataURL(file);

        },
        removeImage: function (target) {
            if(target=='logo'){
                this.shop_logo = null;

            }
            if(target=='cover'){
                this.shop_cover = null;

            }
            if(target=='meal_image'){
                this.meal_image = null;

            }
            if(target=='user_avatar'){
                this.user_avatar = null;
            }
            if(target=='vehicle_pic'){
                this.vehicle_pic = null;
            }
             if(target=='license_pic'){
                this.license_pic = null;
            }
             if(target=='insurance_pic'){
                this.insurance_pic = null;
            }

             if(target=='id_pic'){
                this.id_pic = null;
            }

        },


    }
}
