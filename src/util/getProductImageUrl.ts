export const getProductImageUrl= (product: any) => {
    if (!product.image) return `{import.meta.env.VITE_IMAGE_ROOT_URL}/product_image_comming.png`

    if (product.image.includes('://')) return product.image;

    return `${import.meta.env.VITE_IMAGE_ROOT_URL}${product.category}/${product.image}`;
}