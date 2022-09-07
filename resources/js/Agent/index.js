import { TableComponent, TableColumn } from 'vue-table-component';
import style from 'vue-table-component'
import form from '../mixins/form'
// import StarRating from 'vue-star-rating';

import Multiselect from 'vue-multiselect';
Vue.component('agentsList', {
    props:['fetchDataUrl','role','request'],
    mixins:[form],
    data() {
        return {
            form: {
                disabled: false,
                error: false,
                validations: [],
                message: null,
            },
            currentPage:null,
            per_page:null,
            data:[],
            id:null,
            user_avatar:null,
            name:null,
            mobile:null,
            email:null,
            password:null,
            address:null,
            innerVisible:false,
            innerViewVisible:false,
            user:null,
            // delivery more data
            vehicle_type:null,
            vehicle_plate:null,
            report_period:'',
            custom_period:'',
            wallet_filter:'',
            name_filter:'',
            mobile_filter:'',
            plat_no_filter:'',
            systemsRoles:'',
            systemRoleId:'',
           statesList:[],
            state:null,
        }
    },
    mounted() {
  this.getAllStates();
        // this.getAllRoles();
        // if(this.request=='new'){
        //     // this.markReadNotification();
        // }
    },
    components: {
        'table-component': TableComponent,
        'table-column': TableColumn,
        Multiselect
    },
    methods: {
        // getAllRoles(){
        //     axios.get('/admin/manage/admin/roles/list').then(res=>{
        //         this.systemsRoles=res.data.roles;
        //
        //     });
        // },
        getAllStates(){
            axios.get('/admin/states/list').then(res=>{
                this.statesList=res.data.states;
            });
        },

        dataFormatter(value){
            return moment(value).format("YYYY-MM-DD hh:mm:s A ");
        },
        refreshTable:function(){
            if(this.report_period=='custom' && !this.custom_period){
                swal({
                    title: 'You must enter date period before',
                    text: "",
                    type: "error",
                    timer: 2000,
                    showConfirmButton: false
                });

            }else{

                this.$refs.adminTable.refresh();
            }
        },
        // refreshTable:function(){
        //     this.$refs.adminTable.refresh();
        // },
        resetFilter(){
            this.report_period='';
            this.custom_period='';
            this.wallet_filter='';
            this.name_filter='';
            this.mobile_filter='';
            this.plat_no_filter='';
            this.$refs.adminTable.refresh();
        },
        async fetchData({ page, filter, sort }) {
            jQuery('#loading-div').css('display','block');
            let link=this.fetchDataUrl+"?report_period="+this.report_period+"&custom_period="+this.custom_period+"&wallet="+this.wallet_filter
                +"&name="+this.name_filter+"&mobile="+this.mobile_filter+"&plat_no="+this.plat_no_filter;
            const response = await axios.get(link, {params: { page, filter, sort }});
            this.currentPage= response.data.users.current_page;
            this.per_page= response.data.users.per_page;
            this.data=response.data.users.data;
            jQuery('#loading-div').css('display','none');
            return {
                data: response.data.users.data,
                pagination: {
                    currentPage: response.data.users.current_page,
                    totalPages: response.data.users.last_page
                }
            };
        },
        onlyNumberKey(evt) {

            // Only ASCII charactar in that range allowed
            var ASCIICode = (evt.which) ? evt.which : evt.keyCode
            if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57))
                return false;
            return true;
        },
        addUser() {
            let link=null;
            if(!this.id){
                jQuery('#loading-div').css('display','block');
                link='/admin/agents/create';
            }else{
                link='/admin/agents/update';
            }

            this.form.disabled = true;
            axios.post(link, {
                id:this.id,
                user_avatar:this.user_avatar,
                mobile:this.mobile,
                email:this.email,
                name:this.name,
                state:this.state,
                password:this.password,
                // address:this.address,
                // role:this.role,
                // vehicle_type:this.vehicle_type,
                // vehicle_plate:this.vehicle_plate,
                // systemRoleId:this.systemRoleId
            }).then(response => {
                Swal.fire({
                    title:       "تمت العملية بنجاح",
                    text: "",
                    icon: "success",
                    type: "success",
                    timer: 2000,
                    showConfirmButton: false
                });

                //
                // swal({
                //     title: "تم اضافة المندوب بنجاح",
                //     text: "",
                //     type: "success",
                //     timer: 2000,
                //     showConfirmButton: false
                // });
                this.refreshTable();
                this.clearModelData();
                this.form.disabled=false;
                jQuery('#loading-div').css('display','none');
            }).catch(error => {
                this.form.disabled = false;
                this.form.error = true;
                jQuery('#loading-div').css('display','none');
                if (error.response && error.response.data && error.response.data.errors) {
                    this.form.message = 'There are error in entry data';
                    this.form.validations = error.response.data.errors;
                } else if (error.response && error.response.data.message) {
                    this.form.validations = [];
                    this.form.message = error.response.data.message;
                }
                document.body.scrollTop = 0; // For Chrome, Safari and Opera
                document.documentElement.scrollTop = 0; // For IE and Firefox
            });
        },

        // markReadNotification(){
        //     let link='/admin/markReadNotification';
        //     axios.post(link, {
        //         target:'newDrivers'
        //     }).then(response => {
        //         swal({
        //             title: response.data.message,
        //             text: "",
        //             type: "success",
        //             timer: 2000,
        //             showConfirmButton: false
        //         });
        //
        //         this.form.disabled=false;
        //         jQuery('#loading-div').css('display','none');
        //     }).catch(error => {
        //         this.form.disabled = false;
        //         this.form.error = true;
        //         jQuery('#loading-div').css('display','none');
        //         if (error.response.data.errors) {
        //             this.form.message = 'There are error in entry data';
        //             this.form.validations = error.response.data.errors;
        //         } else if (error.response.data.message) {
        //             this.form.validations = [];
        //             this.form.message = error.response.data.message;
        //         }
        //         document.body.scrollTop = 0; // For Chrome, Safari and Opera
        //         document.documentElement.scrollTop = 0; // For IE and Firefox
        //     });
        // },
        handelEditUser(user){
            this.id=user.id;
            this.user_avatar=user.avatar_url;
            this.name=user.name;
            this.mobile=user.mobile;
            this.email=user.email;
            this.state=user.state;
            this.address=user.address;
            this.innerVisible=true;

            this.vehicle_type=user.vehicle_type;
            this.vehicle_plate= user.vehicle_plate;




        },
        handelViewUser(user){
            console.log(user);
            this.user=user;
            this.id=user.id;
            this.state=user.state;
            this.user_avatar=user.avatar_url;


            this.name=user.name;
            this.mobile=user.mobile;
            this.email=user.email;
            this.address=user.address;
            this.innerViewVisible=true;

        },
        rejectDeliveryUser(url,userId,status){
            let vm= this;
            swal({
                title: "Reject delivery driver!",
                text: "Write reject reason:",
                type: "input",
                showCancelButton: true,
                closeOnConfirm: false,
                inputPlaceholder: "Write reject reason"
            }, function (inputValue) {
                if (inputValue === false) return false;
                if (inputValue === "") {
                    swal.showInputError("You need to write something!");
                    return false
                }
                // swal("Nice!", "You wrote: " + inputValue, "success");
                axios.post(url, {
                    id: userId,
                    status: status,
                    reason:inputValue
                }).then(res => {

                    vm.refreshTable();

                    // vm.$notify({
                    //     title: 'Success',
                    //     message: "Status changed successfully",
                    //     type: 'success',
                    //     position: 'bottom-right',
                    //     offset: 50
                    // });
                    swal("Nice!", "This user removed from system");
                    return true
                });
            });




        },
        deleteAction(action,row_id,refreshTable) {

            swal.fire({
                title: 'هل تريد بالتأكيد حذف الرحلة ',
                text: "",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "نعم قم بالحذف",
                cancelButtonText: 'إلغاء الأمر',
                closeOnConfirm: true,
                closeOnCancel: true,
            }).then((result) => {
                if (result.value) {

                    jQuery('#loading-div').css('display','block');
                    axios.delete(action+ row_id).then(response => {
                        // this.getAllServices();
                        // this.services.splice(this.services.indexOf(service), 1);

                        this.refreshTable();


                        swal.fire({
                            title: response.data.message,
                            text: "",
                            type: "success",
                            timer: 2000,
                            showConfirmButton: false
                        });
                        jQuery('#loading-div').css('display','none');

                    });
                }
            }).catch(error => {

                swal({
                    title: 'Fail to delete  ',
                    text: "",
                    type: "error",
                    timer: 2000,
                    showConfirmButton: false
                });
                jQuery('#loading-div').css('display','none');
            });



        },

        clearModelData(){
            this.innerVisible=false;
            this.id=null;
            this.user_avatar=null;
            this.name=null;
            this.mobile=null;
            this.email=null;
            this.address=null;
            this.password=null;
            this.vehicle_pic=null;
            this.vehicle_type=null;
            this.vehicle_plate=null;
            this.user_avatar=null;


            this.form.error=false;
            this.form.validations=[];
        }

    },


});
