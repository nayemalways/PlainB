import mongoose from 'mongoose';

const DataSchema = mongoose.Schema(
    {
        description: {type: String},
        type: {type: String}
    }
)

const LegalModel = mongoose.model('legals', DataSchema);
export default LegalModel;