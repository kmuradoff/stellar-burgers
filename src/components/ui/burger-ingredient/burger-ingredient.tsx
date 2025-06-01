import React, { FC, memo, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './burger-ingredient.module.css';

import {
  Counter,
  CurrencyIcon
} from '@zlden/react-developer-burger-ui-components';

import { TBurgerIngredientUIProps } from './type';

export const BurgerIngredientUI: FC<TBurgerIngredientUIProps> = memo(
  ({ ingredient, count, locationState }) => {
    const { image, price, name, _id } = ingredient;
    const [isDragging, setIsDragging] = useState(false);

    const handleDragStart = (e: React.DragEvent) => {
      setIsDragging(true);
      e.dataTransfer.setData('ingredient', JSON.stringify(ingredient));
      e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragEnd = () => {
      setIsDragging(false);
    };

    return (
      <li
        className={`${styles.container} ${isDragging ? styles.dragging : ''}`}
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <Link
          className={styles.article}
          to={`/ingredients/${_id}`}
          state={locationState}
        >
          {count && <Counter count={count} />}
          <img className={styles.img} src={image} alt='картинка ингредиента.' />
          <div className={`${styles.cost} mt-2 mb-2`}>
            <p className='text text_type_digits-default mr-2'>{price}</p>
            <CurrencyIcon type='primary' />
          </div>
          <p className={`text text_type_main-default ${styles.text}`}>{name}</p>
        </Link>
      </li>
    );
  }
);
