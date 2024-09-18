import JWT from 'jsonwebtoken';

export const authToken = async (req, res,next) => {
    try{

        const token = req?.headers?.authorization?.split(' ')[1]

        console.log("token",token)
        if(!token){
            return res.status(200).json({
                message : "Please Login...!",
                error : true,
                success : false
            })
        }

        JWT.verify(token, process.env.JWT_SECRET, function(err, decoded) {
            console.log(err)
            console.log("decoded",decoded)
            
            if(err){
                console.log("error auth", err)
            }

            req.userId = decoded?.userId

            next()
        });

    }catch(error){
        console.log('error', error);
        res.status(500).send({
            success: false,
            message: 'Error in login',
            error
        })
    }
}