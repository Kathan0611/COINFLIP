import  Templates  from '../../../models/Spin/admin/template';
import TemplateConfigs from '../../../models/Spin/admin/templateConfig';

export const getTemplateData = async() => {
  return Templates.findAll();
};

export const getTemplates = async(id:string) => { 
 return Templates.findOne({where: {id:id}});
}

export const updateOrCreateTemplate = async (id:string,data: any) => {
  if (id) {
    return Templates.update(data, { where: { id: id } });
  } else {
    return Templates.create(data);
  }
}

// export const getStoreName = async (storeid: string) => {
//   const store = await Stores.findOne({
//     where: { id: storeid },
//     attributes: ['store_name'],
//   });

//   return store ? store.store_name : null;
// };

export const selectedTemplateConfig = async () => {
  return TemplateConfigs.findOne({
    where: { is_default: true },
  });
};

export const getTemplateConfig = async (templateid: string) => {
  const template = TemplateConfigs.findAll();
  return TemplateConfigs.findOne({
    where: {template_id: templateid },
  });
};

export const updateOrCreateTemplateConfig = async (
  templateid: string,
  data: {
    is_default: boolean;
    total_prize_limit: number;
    stripe_texts: {
      id: number;
      text: string;
      image: string;
      degree: number;
      color: string;
    }[];
  },
) => {
  await TemplateConfigs.update({ is_default: false}, {where: {  } });

  const existingConfig = await TemplateConfigs.findOne({
    where: {template_id: templateid },
  });

  if (existingConfig) {
    await existingConfig.update({ ...data });
    return existingConfig;
  } else {
    const newConfig = await TemplateConfigs.create({
      ...data,
      template_id: templateid,
    } as any);
    return newConfig;
  }
};
