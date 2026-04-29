import mongoose from 'mongoose';
import app from './app';

const PORT = process.env.PORT || 5001;

mongoose.connect(process.env.MONGO_URI as string)
.then(() => {
    console.log('MongoDB Connected');

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
.catch((err) => console.log(err));