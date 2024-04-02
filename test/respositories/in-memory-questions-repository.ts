import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public questions: Question[] = []

  constructor(
    private readonly questionAttachmentsRepository: QuestionAttachmentsRepository,
  ) {}

  async create(question: Question) {
    this.questions.push(question)
    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async save(questionToUpdate: Question) {
    const questionIndex = this.questions.findIndex(
      (question) => question.id === questionToUpdate.id,
    )

    this.questions[questionIndex] = questionToUpdate
    DomainEvents.dispatchEventsForAggregate(this.questions[questionIndex].id)
  }

  async findBySlug(slug: string) {
    const questionBySlug = this.questions.find(
      (question) => (question.slug.value = slug),
    )

    if (!questionBySlug) {
      return null
    }

    return questionBySlug
  }

  async findById(questionId: string) {
    const questionById = this.questions.find(
      (question) => question.id.toString() === questionId,
    )

    if (!questionById) {
      return null
    }

    return questionById
  }

  async delete(questionToDelete: Question) {
    const questionIndex = this.questions.findIndex(
      (question) => question.id === questionToDelete.id,
    )

    this.questions.splice(questionIndex, 1)

    await this.questionAttachmentsRepository.deleteManyByQuestionId(
      questionToDelete.id.toString(),
    )
  }

  async findManyRecent({ page }: PaginationParams) {
    const questions = this.questions
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return questions
  }
}
