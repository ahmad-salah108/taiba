import { TableComponent, TableColumn } from 'vue-table-component';
import style from 'vue-table-component'
import form from '../mixins/form'
// import StarRating from 'vue-star-rating';
import Multiselect from 'vue-multiselect';
import dateUtil from 'element-ui/lib/utils/date';
// import VueTimepicker from 'vue2-timepicker';
// import 'vue2-timepicker/dist/VueTimepicker.css';
Vue.component('tripForm', {
    props:['fetchDataUrl','role','request','homeUrl','trip'],
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
            innerVisible:false,
            innerViewVisible:false,
            // delivery more data
            id:null,
            invoice_number:'',
            customersList:[],
            customer:null,
            agentsList:[],
            agent:null,
            driversList:[],
            vehicleList:[],
            drivers:[],
            note:null,
            date:null,
            arrival_time:null,
            return_time:null,
            price:null,
            prepaid_price:null,
            payment_type:'cash',
            reservation_type_id:'',
            reservation_type_text:'',
            vehicle_type:'small',
            vehicle_number:'one',
            trip_type:'going',
            going_note:'',
            going_vehicle_id:'',
            back_vehicle_id:'',
            going_path:'',
            back_note:'',
            back_path:'',
            going_driver_id:'',
            back_driver_id:'',
            tripTypesList:[],
            is_new_customer:false,
            customer_name:'',
            customer_mobile:'',
            vehicles_count:1,
            statesList:[],
            state:null,
            customer_state:null,
            collection_by:null,
            collector_driver_id:null,
            reserved_driver_id:null,
            collector_driver:null,
            reserved_driver:null,
        }
    },
    mounted() {

        this.getAllCustomers();
        this.getAllTypes();
        this.getAllDrivers();
        this.getAllVehicleList();
        this.getAllAgents();
        this.getAllStates();
        // if(this.request=='new'){
        //     // this.markReadNotification();
        // }

        if(this.trip){
            this.handelEditTrip(this.trip);
        }else{
            this.date=moment();
            this.arrival_time=moment().format('HH:mm');
        }

    },
    components: {
        'table-component': TableComponent,
        'table-column': TableColumn,
        Multiselect,


    },
    computed:{
        'remaining_price':function(){
            return (this.price-this.prepaid_price);
        },
        'formatted_date':function(val){
            return moment(this.date).format('Y-MM-DD');
        },
    },
    methods: {
        isNumber: function(evt) {
            evt = (evt) ? evt : window.event;
            var charCode = (evt.which) ? evt.which : evt.keyCode;

            if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode != 46) {
                evt.preventDefault();;
            } else {
                return true;
            }
        },
        getAllStates(){
            axios.get('/admin/states/list').then(res=>{
                this.statesList=res.data.states;
            });
        },

        customerLabel ({ name, mobile }) {
            return `${name} — ${mobile} `
        },
        getAllCustomers(){
            axios.get('/admin/customers/list').then(res=>{
                this.customersList=res.data.customers;

            });
        },
        getAllDrivers(){
            axios.get('/admin/drivers/list').then(res=>{
                this.driversList=res.data.drivers;
            });
        },
        getAllVehicleList(){
            axios.get('/admin/vehicles/list').then(res=>{
                this.vehicleList=res.data.vehicles;
            });
        },
        getAllTypes(){
            axios.get('/admin/trips/trip-types').then(res=>{
                this.tripTypesList=res.data.trip_types;
            });
        },
        getAllAgents(){
            axios.get('/admin/agents/list').then(res=>{
                this.agentsList=res.data.agents;

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

        handleDateChange(idx, date, ele) {
            if(date instanceof Date){
                ele.date = dateUtil.format(date, 'yyyy-MM-dd');
            } else {
                ele.date = date;
            }
        },
        storeTrip() {
            let link=null;
            if(!this.id){
                jQuery('#loading-div').css('display','block');
                link='/admin/trips/store';
            }else{
                link='/admin/trips/update';
            }

            this.form.disabled = true;
            axios.post(link, {
                id:this.id,
                invoice_number:this.invoice_number,
                customer:this.customer,
                agent:this.agent,
                note:this.note,
                date:this.formatted_date,
                arrival_time:this.arrival_time,
                return_time:this.return_time,
                price:this.price,
                prepaid_price:this.prepaid_price,
                payment_type:this.payment_type,
                remaining_price:this.remaining_price,
                drivers:this.drivers,
                reservation_type_id:this.reservation_type_id,
                reservation_type_text:this.reservation_type_text,
                vehicle_number:this.vehicle_number,
                trip_type:this.trip_type,
                going_note:this.going_note,
                going_path:this.going_path,
                back_note:this.back_note,
                back_path:this.back_path,
                going_driver_id:this.going_driver_id,
                back_driver_id:this.back_driver_id,
                vehicle_type:this.vehicle_type,
                is_new_customer:this.is_new_customer,
                customer_name:this.customer_name,
                customer_mobile:this.customer_mobile,
                going_vehicle_id:this.going_vehicle_id,
                back_vehicle_id:this.back_vehicle_id,
                vehicles_count:this.vehicles_count,
                state:this.state,
                customer_state:this.customer_state,
                collection_by:this.collection_by,
                collector_driver_id:this.collector_driver_id,
                reserved_driver_id:this.reserved_driver_id,
                collector_driver:this.collector_driver,
                reserved_driver:this.reserved_driver,

                // address:this.address,
                // role:this.role,
                // vehicle_type:this.vehicle_type,
                // vehicle_plate:this.vehicle_plate,
                // systemRoleId:this.systemRoleId
            }).then(response => {
                   if(response.data.success){

                       // Swal.fire(
                       //     "تم اضافة الرحلة بنجاح",
                       //     'success'
                       // );
                        let fireMessage='تم اضافة الرحلة بنجاح';
                       if(this.id){
                           fireMessage='تم تحديث الرحلة بنجاح';
                       }
                       Swal.fire({
                           title:  fireMessage,
                           text: "",
                           icon: "success",
                           type: "success",
                           timer: 2000,
                           showConfirmButton: false
                       });
                       setTimeout(function(){
                           window.location='/admin/trips';
                       },2000);
                   }

                // this.refreshTable();
                // this.clearModelData();
                this.form.disabled=false;
                // jQuery('#loading-div').css('display','none');
            }).catch(error => {
                this.form.disabled = false;
                this.form.error = true;
                jQuery('#loading-div').css('display','none');
                console.log(error);
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
        handelEditTrip(trip){
            this.id=trip.id;
            this.invoice_number=trip.invoice_number;
            this.customer=trip.customer;
            this.agent=trip.agent;
            this.note=trip.note;
            this.date=trip.date;
            this.arrival_time=trip.arrival_time;
            this.return_time=trip.return_time;
            this.price=trip.price;
            this.prepaid_price=trip.prepaid_price;
            this.payment_type=trip.payment_type;
            this.reservation_type_id=trip.reservation_type;
            this.reservation_type_text=trip.reservation_type_text;
            this.vehicle_type=trip.vehicle_type;
            this.vehicle_number=trip.vehicle_number;
            this.trip_type=trip.trip_type;
            this.going_note=trip.going_note;
            this.going_vehicle_id=trip.going_vehicle;
            this.back_vehicle_id=trip.back_vehicle;
            this.going_path=trip.going_path;
            this.back_note=trip.back_note;
            this.back_path=trip.back_path;
            this.going_driver_id=trip.going_driver;
            this.back_driver_id=trip.back_driver;
            this.vehicles_count=trip.vehicles_count;
            this.state=trip.state;
            this.customer_state=trip.customer_state;
            this.collection_by=trip.collection_by;
            this.collector_driver_id=trip.collector;
            this.reserved_driver_id=trip.reserver;
            this.collector_driver=trip.collector_driver;
            this.reserved_driver=trip.reserved_driver;

        },
        handelViewUser(user){
            console.log(user);
            this.user=user;
            this.id=user.id;
            this.user_avatar=user.avatar_url;


            this.name=user.name;
            this.mobile=user.mobile;
            this.email=user.email;
            this.address=user.address;
            this.collection_by=user.collection_by;
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
            this.collection_by=null;
            this.collector_driver_id=null;
            this.reserved_driver_id=null;



            this.form.error=false;
            this.form.validations=[];
        }

    },
    watch:{

        trip_type:function(newVal){
            if(this.id){
                if(newVal=='going'){
                    this.back_vehicle_id=null;
                    this.back_note=null;
                    this.back_path=null;
                    this.back_driver_id=null;
                    this.return_time=null;
                }
                if(newVal=='back'){
                    this.going_note=null;
                    this.going_vehicle_id=null;
                    this.going_path=null;
                    this.going_driver_id=null;
                    this.arrival_time=null;
                }
            }

        }
    }

});
