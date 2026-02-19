import { Zone, Event, Notification } from '../types';

export const mockZones: Zone[] = [
  {
    id: '1',
    name: 'Дома',
    label: 'Дома',
    latitude: 42.6977,
    longitude: 23.3219,
    radius: 500,
    color: '#3b82f6',
    isPaused: false,
    activeEventsCount: 2,
    useGlobalCategories: true
  },
  {
    id: '2',
    name: 'Офис',
    label: 'Офис',
    latitude: 42.6950,
    longitude: 23.3250,
    radius: 300,
    color: '#10b981',
    isPaused: false,
    activeEventsCount: 1,
    useGlobalCategories: true
  }
];

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Спиране на водоснабдяването',
    description: 'Планирана поддръжка на главния водопровод. Водоснабдяването ще бъде прекъснато.',
    category: 'water',
    severity: 'medium',
    startTime: new Date('2026-01-28T08:00:00'),
    endTime: new Date('2026-01-28T16:00:00'),
    latitude: 42.6985,
    longitude: 23.3215,
    source: 'Софийска вода',
    affectedZones: ['1'],
    distanceFromZone: 150,
    geometry: {
      type: 'polygon',
      coordinates: [
        [18, 18], [28, 18], [28, 28], [18, 28], [18, 18]
      ]
    }
  },
  {
    id: '2',
    title: 'Ремонт на ул. Централна',
    description: 'Проект за подобряване на инфраструктурата. Очаквайте задръствания и шум.',
    category: 'construction-and-repairs',
    severity: 'low',
    startTime: new Date('2026-01-27T07:00:00'),
    endTime: new Date('2026-02-15T18:00:00'),
    latitude: 42.6970,
    longitude: 23.3220,
    source: 'Столична община',
    affectedZones: ['1'],
    distanceFromZone: 200,
    geometry: {
      type: 'linestring',
      coordinates: [
        [15, 22], [20, 24], [25, 23], [30, 25]
      ]
    }
  },
  {
    id: '3',
    title: 'Закъснения на метро линия 3',
    description: 'Поддръжка на сигнализацията. Влаковете закъсняват с 10-15 минути.',
    category: 'public-transport',
    severity: 'low',
    startTime: new Date('2026-01-27T09:00:00'),
    endTime: new Date('2026-01-27T12:00:00'),
    latitude: 42.6945,
    longitude: 23.3255,
    source: 'Метрополитен',
    affectedZones: ['2'],
    distanceFromZone: 120,
    geometry: {
      type: 'linestring',
      coordinates: [
        [45, 48], [48, 50], [52, 52], [55, 50]
      ]
    }
  }
];

export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    eventId: '1',
    title: 'Ново събитие в зоната "Дома"',
    message: 'Спиране на водоснабдяването планирано за 28 януари 2026 г.',
    category: 'water',
    timestamp: new Date('2026-02-18T10:30:00'),
    isRead: false,
    zoneId: '1'
  },
  {
    id: 'n2',
    eventId: '2',
    title: 'Ремонт на ул. Централна',
    message: 'Проект за подобряване на инфраструктурата започва утре.',
    category: 'construction-and-repairs',
    timestamp: new Date('2026-02-17T14:15:00'),
    isRead: false,
    zoneId: '1'
  },
  {
    id: 'n3',
    eventId: '3',
    title: 'Закъснения на метро линия 3',
    message: 'Поддръжка на сигнализацията. Влаковете закъсняват с 10-15 минути.',
    category: 'public-transport',
    timestamp: new Date('2026-02-16T09:00:00'),
    isRead: true,
    zoneId: '2'
  },
  {
    id: 'n4',
    eventId: '1',
    title: 'Актуализация: Водоснабдяване',
    message: 'Прекъсването ще започне в 8:00 и ще продължи до 16:00 часа.',
    category: 'water',
    timestamp: new Date('2026-02-15T16:45:00'),
    isRead: true,
    zoneId: '1'
  },
  {
    id: 'n5',
    eventId: '2',
    title: 'Предстоящо: Ремонтни дейности',
    message: 'Ще се извършват дейности по пътна инфраструктура.',
    category: 'construction-and-repairs',
    timestamp: new Date('2026-02-14T11:20:00'),
    isRead: true,
    zoneId: '1'
  },
  {
    id: 'n6',
    eventId: '3',
    title: 'Информация за трафика',
    message: 'Очаква се увеличен трафик в близост до зоната "Офис".',
    category: 'traffic',
    timestamp: new Date('2026-02-13T08:00:00'),
    isRead: true,
    zoneId: '2'
  },
  {
    id: 'n7',
    eventId: '1',
    title: 'Събитие в зоната "Дома"',
    message: 'Планирани ремонтни дейности в района.',
    category: 'maintenance',
    timestamp: new Date('2026-02-12T15:30:00'),
    isRead: true,
    zoneId: '1'
  },
  {
    id: 'n8',
    eventId: '2',
    title: 'Актуализация на графика',
    message: 'Променен график на дейностите поради метеорологични условия.',
    category: 'construction-and-repairs',
    timestamp: new Date('2026-02-11T10:00:00'),
    isRead: true,
    zoneId: '1'
  },
  {
    id: 'n9',
    eventId: '3',
    title: 'Обслужване на електрическата мрежа',
    message: 'Кратко прекъсване на електрозахранването за ��рофилактика.',
    category: 'electricity',
    timestamp: new Date('2026-02-10T14:45:00'),
    isRead: true,
    zoneId: '1'
  },
  {
    id: 'n10',
    eventId: '1',
    title: 'Събитие в зоната "Офис"',
    message: 'Паркинг ограничения в района заради културно събитие.',
    category: 'parking',
    timestamp: new Date('2026-02-09T09:15:00'),
    isRead: true,
    zoneId: '2'
  },
  {
    id: 'n11',
    eventId: '2',
    title: 'Промяна в маршрута на автобус 280',
    message: 'Временна промяна на маршрута поради ремонт на улица.',
    category: 'public-transport',
    timestamp: new Date('2026-02-08T07:30:00'),
    isRead: true,
    zoneId: '2'
  },
  {
    id: 'n12',
    eventId: '3',
    title: 'Почистване на улична мрежа',
    message: 'Планирано почистване и дезинфекция на уличната мрежа.',
    category: 'maintenance',
    timestamp: new Date('2026-02-07T13:00:00'),
    isRead: true,
    zoneId: '1'
  }
];