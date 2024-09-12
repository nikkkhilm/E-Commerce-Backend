class ApiFeatures{
    constructor(query,queryStr)
    {
        this.query=query;
        this.queryStr=queryStr;
    }

    search(){
        // we had sent only req.query there for querystr so we are accessing queries keyword here
        const keyword = this.queryStr.keyword ?{
            name:{
                $regex:this.queryStr.keyword,
                $options:"i",
            }
        }:{};

        // console.log(keyword)

        this.query = this.query.find({...keyword});
        return this;
    }

    filter()
    {
        // here by refrence it will be assigned if we write const queryCopy=this.queryStr so use spread operator which creates new object
        const queryCopy={...this.queryStr};

        // removing some fields for category as keywords in search,page in pagination
        const removeFields = ["keyword","page","limit"];

        removeFields.forEach(key=>delete queryCopy[key]);

        console.log(queryCopy)

        // filter for price and rating

        let queryStr = JSON.stringify(queryCopy);
        
        // we are sending just gt,lt,gte,lte as params so we not to ad d $ in front of them so that we can use it for querying only for price
        queryStr=queryStr.replace(/\b(gt|gte|lt|lte)\b/g,(key)=>`$${key}`);

        this.query = this.query.find(JSON.parse(queryStr));
        
        console.log(queryStr)
        
        return this
    }

    pagination(resultPerPage)
    {
        const currentPage = Number(this.queryStr.page) || 1;

        const skip = resultPerPage * (currentPage-1);

        this.query = this.query.limit(resultPerPage).skip(skip)

        return this;
    }
}

module.exports = ApiFeatures