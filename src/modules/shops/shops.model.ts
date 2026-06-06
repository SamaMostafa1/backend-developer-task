import {
  Table,
  Column,
  DataType,
  PrimaryKey,
  Model,
  HasMany,
} from 'sequelize-typescript';
import { Product } from '../products/products.model';

@Table({ tableName: 'shops' })
export class Shop extends Model<Shop> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  name: string;

  @Column({ type: DataType.DATE, allowNull: false })
  openingHour: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  closingHour: Date;

  @Column({ type: DataType.STRING(32), allowNull: false })
  availability: string;
  //added this to make sure that when we fetch shops with products using include, we get the products as well
   @HasMany(() => Product)  
  products: Product[];
}
