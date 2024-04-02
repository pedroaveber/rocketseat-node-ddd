import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'

export class InMemoryQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  public questionComments: QuestionComment[] = []

  async create(questionComment: QuestionComment) {
    this.questionComments.push(questionComment)
  }

  async findById(id: string) {
    const questionCommentById = this.questionComments.find(
      (questionComment) => questionComment.id.toString() === id,
    )

    if (!questionCommentById) {
      return null
    }

    return questionCommentById
  }

  async delete(questionCommentToDelete: QuestionComment) {
    const questionCommentIndex = this.questionComments.findIndex(
      (questionCommen) => questionCommen.id === questionCommentToDelete.id,
    )

    this.questionComments.splice(questionCommentIndex, 1)
  }

  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    const commentsByQuestionId = this.questionComments
      .filter(
        (questionComment) =>
          questionComment.questionId.toString() === questionId,
      )
      .slice((page - 1) * 20, page * 20)

    return commentsByQuestionId
  }
}
