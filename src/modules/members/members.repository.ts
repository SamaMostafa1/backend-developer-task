import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Member } from 'src/modules/members/members.model';

@Injectable()
export class MembersRepository {
  constructor(
    @InjectModel(Member) private readonly memberModel: typeof Member,
  ) {}

  /**
   * Creates a member row in the database.
   *
   * @param {Partial<Member>} member - Member fields to save.
   * @returns {Promise<Member>} The created member row.
   * @throws {Error} If the database insert fails (for example: DB is down, invalid column value).
   */
  async create(member: Partial<Member>): Promise<Member> {
    return this.memberModel.create(member);
  }

/**
 * Finds all members with pagination
 * @param limit - Number of members to return per page
 * @param offset - Number of members to skip
 * @returns rows (paginated members) and count (total members in DB)
 * NOTE: count returns the TOTAL number of members in the database,
 * not just the current page. This is needed to calculate totalPages
 * on the client side (totalPages = Math.ceil(count / limit)),
 * so the client knows when to stop fetching pages.
 */
 async findAll(limit: number, offset: number): Promise<{ rows: Member[], count: number }> {
  return this.memberModel.findAndCountAll({
    limit,
    offset,
  });
}

  /**
   * Fetches a single member by ID.
   *
   * @param {string} id - Member ID to look up.
   * @returns {Promise<Member>} The member row (can be `null` at runtime if not found).
   * @throws {Error} If the database query fails.
   */
  async findOne(id: string): Promise<Member> {
    return this.memberModel.findByPk(id);
  }

  /**
   * Updates a member by ID and returns the updated row.
   *
   * @param {string} id - Member ID to update.
   * @param {Partial<Member>} member - Fields to update.
   * @returns {Promise<Member>} The updated member row (can be `undefined` at runtime if not found).
   * @throws {Error} If the database update fails.
   */
  async update(id: string, member: Partial<Member>): Promise<Member> {
    const result = await this.memberModel.update(member, {
      where: { id },
      returning: true,
    });

    return result[1][0];
  }

  /**
   * Deletes a member by ID.
   *
   * @param {string} id - Member ID to delete.
   * @returns {Promise<void>} Resolves when the delete query finishes.
   * @throws {Error} If the database delete fails.
   */
  async delete(id: string): Promise<number> {
    return await this.memberModel.destroy({ where: { id } });
  }
}
