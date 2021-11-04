const User = require("../models/User");
const {multiplemongooseToObject, mongooseToObject} = require("../util/mongoose.js");
const carStatusSevice = require('./CarStatusService');
const carService = require('./CarService');
const userService = require('./UserService');
const vehicleCensorshipService = require('./VehicleCensorshipService')
class UserService{

    getUserList = async () =>{
        return await User.find({}) // return về promise
            .then(users =>{
                return multiplemongooseToObject(users);  //return về data promise
            })
            .catch(err => err);
    }

    getUserByID = async (id) =>{
        return await User.findById({_id: id})
            .then(user =>{
                return mongooseToObject(user);
            })
            .catch(err => err);
    }

    addUser = async(object) =>{
        const user = new User(object);
        return await user.save()
            .then(user =>{
                return mongooseToObject(user);
            })
            .catch(err => err);
    }
    updateUserInfor = async(id, object) =>{
        return await User.findByIdAndUpdate({_id: id}, object)
        .then(async user =>{
            user = mongooseToObject(user)
            //lưu hình ảnh vehicle_ship
            const vehicle_censorship = await vehicleCensorshipService.getVehicleCensorshipByUserId(user._id)
            .catch(err => err);
            //nếu đã có hình ảnh của tài xế rồi thì cập nhật hình ảnh
            // console.log('vehicle_censorship', vehicle_censorship)
            if(vehicle_censorship)
                user.vehicle_censorship = await vehicleCensorshipService.updateVehicleCensorshipByUserIDForUserInfor(user._id, object.file_images)
                    .catch(err => err);
            else
                user.vehicle_censorship = await vehicleCensorshipService.addVehicleCensorship(user._id,object.file_images)
                    .then(data => data)
                    .catch(err => err);
            
            return user;
        
        
        })
        .catch(err => err);


    }

    updateUser = async(id, object) =>{
        return await User.findByIdAndUpdate({_id: id}, object)
            .then(async user =>{
                user = mongooseToObject(user)
                //lưu hình ảnh vehicle_ship
                const vehicle_censorship = await vehicleCensorshipService.getVehicleCensorshipByUserId(user._id)
                .catch(err => err);
                //nếu đã có hình ảnh của tài xế rồi thì cập nhật hình ảnh
                // console.log('vehicle_censorship', vehicle_censorship)
                if(vehicle_censorship)
                    user.vehicle_censorship = await vehicleCensorshipService.updateVehicleCensorshipByUserID(user._id, object.file_images)
                        .catch(err => err);
                else
                    user.vehicle_censorship = await vehicleCensorshipService.addVehicleCensorship(user._id,object.file_images)
                        .then(data => data)
                        .catch(err => err);
                
                return user;
            
            
            })
            .catch(err => err);

    
    }

    deleteUser = async(id) =>{
        return await User.findByIdAndRemove({_id: id})
            .then(user =>{
                return mongooseToObject(user);
            })
            .catch(err => err);
    }

    getUserDetailByEmail = async(email_param) =>{
        return await User.findOne({email: email_param})
            .then(user => mongooseToObject(user))
            .catch(err=>err);
    }

    getAllUserDriverNoCensorship = async () => {
        //lấy ra mảng car status chưa được kiểm duyệt
        const carStatusNoCensorshipList = await carStatusSevice.getAllCarStatusNoCensorship()
            .catch(err => err);
        
        //lấy mảng user[driver] chưa được kiểm duyệt bằng user_id trong CARINFOR 
        const userDriverNoCensorship = Promise.all(carStatusNoCensorshipList.map(async carStatus => {
            const car_infor = await carService.getCarbyID(carStatus.car_id);
            const user_id = car_infor.user_id.toString();
            const userDriver = await this.getUserByID(user_id)
                return userDriver;
        }))
        return await userDriverNoCensorship;
    }
}

module.exports = new UserService();