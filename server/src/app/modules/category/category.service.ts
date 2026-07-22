import CategoryModel from './category.model.ts';

const getCategoryList = async () => {
  try {
    const data = await CategoryModel.find();
    return { status: 'Success', data };
  } catch (error) {
    console.error(error);
    return { status: 'error', message: 'Internal server error' };
  }
};

export const categoryServices = {
  getCategoryList,
};
