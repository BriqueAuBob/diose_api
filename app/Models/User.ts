import { DateTime } from "luxon";
import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public discord_id: string;

  @column({ serializeAs: null })
  public email: string;

  @column()
  public username: string;

  @column()
  public discriminator: number;

  @column()
  public avatar: string;

  @column({ serializeAs: null })
  public code: string | null;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
