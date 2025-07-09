 module.exports=(fn)=>{
    return function(req, res, next){
        const result = fn(req, res, next);
       
          if (result && typeof result.catch === 'function') {
      result.catch(err => next(err));
    }
    }
}