//src/services/admin/mediaService.ts
import { MediaInterface } from "media";
import Media from "../../models/Media"

export const getMediaList = async () => {
	return await Media.findAll();
}

export const mediaDelete = async (id: number) => {
	const existingMedia = await Media.findOne({
		where: {
			id: id,
			media_type:'banner'
		}
	});
	if (!existingMedia) {
		return { error: 'NO_SUCH_FILE' };
	}
	return await Media.destroy({ where: { id: id } });
}

export const create = async (images: any) => {
	const finalReords: MediaInterface[] = [] ;
	images.forEach(function (countElement: any) {
		const requestParam = {
			media_path: countElement.filename,
			media_type: 'banner'
		}
		finalReords.push(requestParam as MediaInterface);
	  });
	return await Media.bulkCreate(finalReords);

}