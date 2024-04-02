import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Notification,
  NotificationProps,
} from '@/domain/notification/enterprise/entities/notification'

export function makeNotification(
  override: Partial<NotificationProps> = {},
  id?: UniqueEntityID,
) {
  const notification = Notification.create(
    {
      content: faker.lorem.sentence(10),
      recipientId: new UniqueEntityID(),
      title: faker.lorem.sentence(4),
      ...override,
    },
    id,
  )

  return notification
}
