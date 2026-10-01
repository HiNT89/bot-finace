import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Between, Repository } from "typeorm";
import { today } from "../common/date";
import { WorkDayType } from "../common/enums";
import { WorkDay } from "../database/entities";
@Injectable()
export class WorkDaysService {
  constructor(
    @InjectRepository(WorkDay) private readonly workDays: Repository<WorkDay>,
  ) {}
  async upsert(
    userId: string,
    type: WorkDayType,
    date = today(),
    note?: string,
  ) {
    const existing = await this.workDays.findOneBy({ userId, date });
    return this.workDays.save(
      existing
        ? { ...existing, type, note }
        : this.workDays.create({ userId, date, type, note }),
    );
  }
  findForDay(userId: string, date = today()) {
    return this.workDays.findOneBy({ userId, date });
  }
  countWorked(userId: string, start: string, end: string) {
    return this.workDays.count({
      where: [
        { userId, type: WorkDayType.OFFICE, date: Between(start, end) },
        { userId, type: WorkDayType.REMOTE, date: Between(start, end) },
      ],
    });
  }
}
