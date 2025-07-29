import type { Product } from '../types/index';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <Link to={`/products/${product._id}`} className="block">
        {/* Product Image */}
        <div className="relative">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-48 object-contain"
            loading="lazy"
          />
          {/* Price Badge */}
          <div className="absolute top-2 left-2 bg-white px-2 py-1 rounded shadow">
            <span className="text-lg font-bold text-red-600">₹{product.price}</span>
            <span className="text-xs text-gray-500 ml-1">per metre</span>
          </div>
        </div>
        
        {/* Product Info */}
        <div className="p-3">
          {/* Product Name */}
          <h3 className="text-sm font-medium text-gray-900 mb-1 hover:text-red-600 transition-colors">
            {product.name}
          </h3>
          
          {/* Stock Info */}
          <p className="text-xs text-gray-500">
            {product.quantity} metres left
          </p>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;