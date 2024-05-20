
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Users } from '../../database/schema/user.entity'; 
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Columns } from 'src/database/schema/column.entity';
import { Cards } from 'src/database/schema/card.entity';
import { Comments } from 'src/database/schema/comment.entity';
import { UserDto } from 'src/auth/dto/user.dto';

@Injectable()
export class CardService {
    constructor(
        @InjectRepository(Users) 
        private readonly userRepository: Repository<Users>,
        @InjectRepository(Columns)
        private readonly columnRepository: Repository<Columns>,
        @InjectRepository(Cards)
        private readonly cardRepository: Repository<Cards>,
    ) {}

    async createCard(user_id: uuidv4, card_name: string, column_name: string): Promise<boolean> {
        const column = await this.columnRepository.findOne({ where: { user_id, column_name } });
        const column_id = column?.column_id;
        const newCard = this.cardRepository.create({ user_id, card_name, column_id });
        const createdCard = await this.cardRepository.save(newCard);
        return !!createdCard;
    }
    async getCard(user_id: uuidv4, column_name: string, card_name: string): Promise<string> {
        const column = await this.columnRepository.findOne({ where: { user_id, column_name } });
        const column_id = column?.column_id;
        const card = await this.cardRepository.findOne({ where: { user_id, column_id, card_name} });
        return JSON.stringify(card);
    }

    async cardExisted(user_id: uuidv4, column_name: string, card_name: string): Promise<boolean> {
        if (!this.cardRepository) {
        throw new Error('cardRepository is not defined or is undefined');
        }
        const column = await this.columnRepository.findOne({ where: { user_id, column_name } });
        const column_id = column?.column_id;
        const card = await this.cardRepository.findOne({ where: { user_id, column_id, card_name} });
        return !!card; 
    }

    async deleteCard(user_id: uuidv4, column_name: string, card_name: string): Promise<boolean> {
        const column = await this.columnRepository.findOne({ where: { user_id, column_name } });
        const column_id = column?.column_id;

        const deletedColumn = await this.cardRepository.delete({ user_id, column_id, card_name });
        return !!deletedColumn.affected;
    }
}