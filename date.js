module.exports.getdate=function (){
    var today= new Date();
    var options={
      weekday:"long",
      month:"long",
      day:"2-digit"
    }
    let day=today.toLocaleDateString("en-US",options);
    return day;
}

module.exports.getday=     function () {
    var today= new Date();
    var options={
      weekday:"long",
    }
    let day=today.toLocaleDateString("en-US",options);
    return day;
}