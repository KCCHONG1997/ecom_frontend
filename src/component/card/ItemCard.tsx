import React from 'react';
import { Card, Button } from 'antd';

const { Meta } = Card;

export interface ItemCardProps {
    image: string;
    title: string;
    description: string;
    price: string;
    size?: 'small' | 'medium' | 'large'; // Size control
    onAddToCart?: () => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ image, title, description, price, size = 'medium', onAddToCart }) => {
    const sizeStyles = {
        small: { width: 200, fontSize: '12px', imageHeight: '100px' },
        medium: { width: 300, fontSize: '14px', imageHeight: '200px' },
        large: { width: 400, fontSize: '16px', imageHeight: '300px' },
    };

    const currentSize = sizeStyles[size];

    return (
        <Card
            hoverable={true}
            cover={
                <img
                    alt={title}
                    src={image}
                    style={{ height: currentSize.imageHeight, objectFit: 'cover' }}
                />
            }
            style={{ width: 300, margin: '16px', userSelect:'none' }}
        >
            <Meta title={title} description={description} />
            <div style={{ marginTop: '16px' }}>
                <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '8px' }}>Price: {price}</div>

                {onAddToCart && (
                    <Button type="primary" block onClick={onAddToCart}>
                        Add to Cart
                    </Button>
                )}

            </div>
        </Card>
    );
};

export default ItemCard;
