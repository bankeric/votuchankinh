'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowLeft,
  Users,
  Brain,
  Settings,
  MessageSquare,
  Trash2,
  Edit,
  Plus,
  Save,
  X,
} from 'lucide-react'
import Image from 'next/image'

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
  conversations: number
  lastActive: Date
  status: 'active' | 'inactive'
}

interface TrainingData {
  id: string
  question: string
  response: string
  category: 'zen' | 'meditation' | 'philosophy' | 'general'
  status: 'approved' | 'pending' | 'rejected'
  createdAt: Date
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'users' | 'training' | 'settings'>(
    'users'
  )
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Minh Nguyen',
      email: 'minh@example.com',
      role: 'user',
      conversations: 15,
      lastActive: new Date(),
      status: 'active',
    },
    {
      id: '2',
      name: 'Linh Tran',
      email: 'linh@example.com',
      role: 'admin',
      conversations: 8,
      lastActive: new Date(Date.now() - 86400000),
      status: 'active',
    },
    {
      id: '3',
      name: 'Duc Le',
      email: 'duc@example.com',
      role: 'user',
      conversations: 23,
      lastActive: new Date(Date.now() - 172800000),
      status: 'inactive',
    },
  ])

  const [trainingData, setTrainingData] = useState<TrainingData[]>([
    {
      id: '1',
      question: 'What is the nature of consciousness?',
      response:
        'Before asking about consciousness, who is the one asking? What is this "Who" that seeks to understand?',
      category: 'zen',
      status: 'approved',
      createdAt: new Date(),
    },
    {
      id: '2',
      question: 'How do I find inner peace?',
      response:
        'Peace is not something to find. It is your original nature. Right now, what is aware of the search for peace?',
      category: 'meditation',
      status: 'pending',
      createdAt: new Date(Date.now() - 86400000),
    },
  ])

  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [newTraining, setNewTraining] = useState<Partial<TrainingData>>({})
  const [showNewTraining, setShowNewTraining] = useState(false)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  } as Variants

  const handleUserEdit = (user: User) => {
    setEditingUser(user)
  }

  const handleUserSave = () => {
    if (editingUser) {
      setUsers((prev) =>
        prev.map((u) => (u.id === editingUser.id ? editingUser : u))
      )
      setEditingUser(null)
    }
  }

  const handleUserDelete = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId))
  }

  const handleTrainingAdd = () => {
    if (newTraining.question && newTraining.response && newTraining.category) {
      const training: TrainingData = {
        id: Date.now().toString(),
        question: newTraining.question,
        response: newTraining.response,
        category: newTraining.category as TrainingData['category'],
        status: 'pending',
        createdAt: new Date(),
      }
      setTrainingData((prev) => [training, ...prev])
      setNewTraining({})
      setShowNewTraining(false)
    }
  }

  const handleTrainingStatusChange = (
    id: string,
    status: TrainingData['status']
  ) => {
    setTrainingData((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t))
    )
  }

  const handleTrainingDelete = (id: string) => {
    setTrainingData((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <main className='min-h-screen text-[#f5f5f5] relative'>
      {/* Header */}
      <header className='fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-4 bg-background/40 backdrop-blur-md border-b border-[#991b1b]/30'>
        <div className='flex items-center space-x-4'>
          <Link
            href='/ai'
            className='flex items-center space-x-2 text-[#991b1b]/80 hover:text-[#991b1b] transition-colors bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full'
          >
            <ArrowLeft className='w-4 h-4' />
            <span className='font-serif text-sm'>Back to AI</span>
          </Link>
        </div>

        <div className='flex items-center space-x-4'>
          <Image
            src='/images/logo.png'
            alt='Giac Ngo logo'
            width={50}
            height={50}
            className='h-12 w-12 object-contain'
            priority
          />
        </div>

        <div className='flex items-center space-x-2'></div>
      </header>

      <div className='pt-20 p-8'>
        <motion.div
          className='max-w-6xl mx-auto'
          variants={containerVariants}
          initial='hidden'
          animate='visible'
        >
          {/* Tab Navigation */}
          <motion.div
            className='flex space-x-4 mb-8'
            variants={itemVariants}
          >
            {[
              { id: 'users', label: 'User Management', icon: Users },
              { id: 'training', label: 'AI Training', icon: Brain },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() =>
                  setActiveTab(tab.id as 'users' | 'training' | 'settings')
                }
                className={`flex items-center space-x-2 px-6 py-3 rounded-full border transition-all duration-300 font-serif ${
                  activeTab === tab.id
                    ? 'bg-[#991b1b]/20 border-[#991b1b]/60 text-[#991b1b]'
                    : 'bg-black/20 border-[#991b1b]/30 text-[#991b1b]/60 hover:border-[#991b1b]/60 hover:text-[#991b1b]'
                }`}
              >
                <tab.icon className='w-4 h-4' />
                <span>{tab.label}</span>
              </button>
            ))}
          </motion.div>

          {/* Users Tab */}
          {activeTab === 'users' && (
            <motion.div
              variants={itemVariants}
              className='space-y-6'
            >
              <div className='flex justify-between items-center'>
                <h2 className='text-2xl font-serif text-[#991b1b]'>
                  User Management
                </h2>
                <div className='text-sm font-serif text-[#991b1b]/70'>
                  Total Users: {users.length} | Active:{' '}
                  {users.filter((u) => u.status === 'active').length}
                </div>
              </div>

              <div className='grid gap-4'>
                {users.map((user) => (
                  <div
                    key={user.id}
                    className='bg-black/30 backdrop-blur-sm border border-[#991b1b]/30 rounded-lg p-6 hover:border-[#991b1b]/50 transition-colors'
                  >
                    {editingUser?.id === user.id ? (
                      <div className='space-y-4'>
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                          <input
                            type='text'
                            value={editingUser.name}
                            onChange={(e) =>
                              setEditingUser({
                                ...editingUser,
                                name: e.target.value,
                              })
                            }
                            className='bg-black/30 border border-[#991b1b]/50 rounded px-3 py-2 text-[#f5f5f5] font-serif'
                          />
                          <input
                            type='email'
                            value={editingUser.email}
                            onChange={(e) =>
                              setEditingUser({
                                ...editingUser,
                                email: e.target.value,
                              })
                            }
                            className='bg-black/30 border border-[#991b1b]/50 rounded px-3 py-2 text-[#f5f5f5] font-serif'
                          />
                          <select
                            value={editingUser.role}
                            onChange={(e) =>
                              setEditingUser({
                                ...editingUser,
                                role: e.target.value as User['role'],
                              })
                            }
                            className='bg-black/30 border border-[#991b1b]/50 rounded px-3 py-2 text-[#f5f5f5] font-serif'
                          >
                            <option value='user'>User</option>
                            <option value='admin'>Admin</option>
                          </select>
                        </div>
                        <div className='flex space-x-2'>
                          <button
                            onClick={handleUserSave}
                            className='flex items-center space-x-2 px-4 py-2 bg-[#991b1b]/20 hover:bg-[#991b1b]/30 border border-[#991b1b]/40 rounded-full text-[#991b1b] transition-colors'
                          >
                            <Save className='w-4 h-4' />
                            <span className='font-serif text-sm'>Save</span>
                          </button>
                          <button
                            onClick={() => setEditingUser(null)}
                            className='flex items-center space-x-2 px-4 py-2 bg-black/20 hover:bg-black/30 border border-[#991b1b]/30 rounded-full text-[#991b1b]/70 transition-colors'
                          >
                            <X className='w-4 h-4' />
                            <span className='font-serif text-sm'>Cancel</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className='flex justify-between items-center'>
                        <div className='space-y-2'>
                          <div className='flex items-center space-x-4'>
                            <h3 className='text-lg font-serif text-[#991b1b]'>
                              {user.name}
                            </h3>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-serif ${
                                user.role === 'admin'
                                  ? 'bg-[#991b1b]/20 text-[#991b1b] border border-[#991b1b]/40'
                                  : 'bg-black/20 text-[#991b1b]/70 border border-[#991b1b]/30'
                              }`}
                            >
                              {user.role}
                            </span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-serif ${
                                user.status === 'active'
                                  ? 'bg-green-500/20 text-green-400 border border-green-500/40'
                                  : 'bg-red-500/20 text-red-400 border border-red-500/40'
                              }`}
                            >
                              {user.status}
                            </span>
                          </div>
                          <p className='text-[#991b1b]/70 font-serif'>
                            {user.email}
                          </p>
                          <div className='flex space-x-4 text-sm font-serif text-[#991b1b]/60'>
                            <span>{user.conversations} conversations</span>
                            <span>
                              Last active:{' '}
                              {user.lastActive.toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className='flex space-x-2'>
                          <button
                            onClick={() => handleUserEdit(user)}
                            className='flex items-center space-x-2 px-3 py-2 bg-[#991b1b]/10 hover:bg-[#991b1b]/20 border border-[#991b1b]/30 rounded-full text-[#991b1b] transition-colors'
                          >
                            <Edit className='w-4 h-4' />
                          </button>
                          <button
                            onClick={() => handleUserDelete(user.id)}
                            className='flex items-center space-x-2 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-full text-red-400 transition-colors'
                          >
                            <Trash2 className='w-4 h-4' />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Training Tab */}
          {activeTab === 'training' && (
            <motion.div
              variants={itemVariants}
              className='space-y-6'
            >
              <div className='flex justify-between items-center'>
                <h2 className='text-2xl font-serif text-[#991b1b]'>
                  AI Training Data
                </h2>
                <button
                  onClick={() => setShowNewTraining(true)}
                  className='flex items-center space-x-2 px-4 py-2 bg-[#991b1b]/20 hover:bg-[#991b1b]/30 border border-[#991b1b]/40 rounded-full text-[#991b1b] transition-colors'
                >
                  <Plus className='w-4 h-4' />
                  <span className='font-serif text-sm'>Add Training Data</span>
                </button>
              </div>

              {showNewTraining && (
                <div className='bg-black/30 backdrop-blur-sm border border-[#991b1b]/30 rounded-lg p-6'>
                  <h3 className='text-lg font-serif text-[#991b1b] mb-4'>
                    New Training Data
                  </h3>
                  <div className='space-y-4'>
                    <div>
                      <label className='block text-sm font-serif text-[#991b1b]/70 mb-2'>
                        Question
                      </label>
                      <textarea
                        value={newTraining.question || ''}
                        onChange={(e) =>
                          setNewTraining({
                            ...newTraining,
                            question: e.target.value,
                          })
                        }
                        className='w-full bg-black/30 border border-[#991b1b]/50 rounded px-3 py-2 text-[#f5f5f5] font-serif h-20'
                        placeholder='Enter the question...'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-serif text-[#991b1b]/70 mb-2'>
                        Response
                      </label>
                      <textarea
                        value={newTraining.response || ''}
                        onChange={(e) =>
                          setNewTraining({
                            ...newTraining,
                            response: e.target.value,
                          })
                        }
                        className='w-full bg-black/30 border border-[#991b1b]/50 rounded px-3 py-2 text-[#f5f5f5] font-serif h-32'
                        placeholder='Enter the AI response...'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-serif text-[#991b1b]/70 mb-2'>
                        Category
                      </label>
                      <select
                        value={newTraining.category || ''}
                        onChange={(e) =>
                          setNewTraining({
                            ...newTraining,
                            category: e.target
                              .value as TrainingData['category'],
                          })
                        }
                        className='bg-black/30 border border-[#991b1b]/50 rounded px-3 py-2 text-[#f5f5f5] font-serif'
                      >
                        <option value=''>Select category</option>
                        <option value='zen'>Zen</option>
                        <option value='meditation'>Meditation</option>
                        <option value='philosophy'>Philosophy</option>
                        <option value='general'>General</option>
                      </select>
                    </div>
                    <div className='flex space-x-2'>
                      <button
                        onClick={handleTrainingAdd}
                        className='flex items-center space-x-2 px-4 py-2 bg-[#991b1b]/20 hover:bg-[#991b1b]/30 border border-[#991b1b]/40 rounded-full text-[#991b1b] transition-colors'
                      >
                        <Save className='w-4 h-4' />
                        <span className='font-serif text-sm'>Add</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowNewTraining(false)
                          setNewTraining({})
                        }}
                        className='flex items-center space-x-2 px-4 py-2 bg-black/20 hover:bg-black/30 border border-[#991b1b]/30 rounded-full text-[#991b1b]/70 transition-colors'
                      >
                        <X className='w-4 h-4' />
                        <span className='font-serif text-sm'>Cancel</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className='grid gap-4'>
                {trainingData.map((data) => (
                  <div
                    key={data.id}
                    className='bg-black/30 backdrop-blur-sm border border-[#991b1b]/30 rounded-lg p-6 hover:border-[#991b1b]/50 transition-colors'
                  >
                    <div className='space-y-4'>
                      <div className='flex justify-between items-start'>
                        <div className='flex-1 space-y-2'>
                          <div className='flex items-center space-x-2'>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-serif ${
                                data.category === 'zen'
                                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
                                  : data.category === 'meditation'
                                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                                  : data.category === 'philosophy'
                                  ? 'bg-green-500/20 text-green-400 border border-green-500/40'
                                  : 'bg-gray-500/20 text-gray-400 border border-gray-500/40'
                              }`}
                            >
                              {data.category}
                            </span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-serif ${
                                data.status === 'approved'
                                  ? 'bg-green-500/20 text-green-400 border border-green-500/40'
                                  : data.status === 'pending'
                                  ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40'
                                  : 'bg-red-500/20 text-red-400 border border-red-500/40'
                              }`}
                            >
                              {data.status}
                            </span>
                          </div>
                          <div>
                            <h4 className='font-serif text-[#991b1b] font-semibold'>
                              Q: {data.question}
                            </h4>
                            <p className='font-serif text-[#991b1b]/80 mt-2'>
                              A: {data.response}
                            </p>
                          </div>
                          <p className='text-xs font-serif text-[#991b1b]/60'>
                            Created: {data.createdAt.toLocaleDateString()}
                          </p>
                        </div>
                        <div className='flex flex-col space-y-2 ml-4'>
                          <div className='flex space-x-1'>
                            <button
                              onClick={() =>
                                handleTrainingStatusChange(data.id, 'approved')
                              }
                              className='px-2 py-1 bg-green-500/20 hover:bg-green-500/30 border border-green-500/40 rounded text-green-400 text-xs font-serif transition-colors'
                            >
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                handleTrainingStatusChange(data.id, 'rejected')
                              }
                              className='px-2 py-1 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 rounded text-red-400 text-xs font-serif transition-colors'
                            >
                              Reject
                            </button>
                          </div>
                          <button
                            onClick={() => handleTrainingDelete(data.id)}
                            className='flex items-center justify-center px-2 py-1 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded text-red-400 transition-colors'
                          >
                            <Trash2 className='w-3 h-3' />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <motion.div
              variants={itemVariants}
              className='space-y-6'
            >
              <h2 className='text-2xl font-serif text-[#991b1b]'>
                System Settings
              </h2>

              <div className='grid gap-6'>
                <div className='bg-black/30 backdrop-blur-sm border border-[#991b1b]/30 rounded-lg p-6'>
                  <h3 className='text-lg font-serif text-[#991b1b] mb-4'>
                    AI Model Configuration
                  </h3>
                  <div className='space-y-4'>
                    <div>
                      <label className='block text-sm font-serif text-[#991b1b]/70 mb-2'>
                        Response Temperature
                      </label>
                      <input
                        type='range'
                        min='0'
                        max='1'
                        step='0.1'
                        defaultValue='0.7'
                        className='w-full'
                      />
                      <div className='flex justify-between text-xs font-serif text-[#991b1b]/60 mt-1'>
                        <span>Conservative</span>
                        <span>Creative</span>
                      </div>
                    </div>
                    <div>
                      <label className='block text-sm font-serif text-[#991b1b]/70 mb-2'>
                        Max Response Length
                      </label>
                      <select className='bg-black/30 border border-[#991b1b]/50 rounded px-3 py-2 text-[#f5f5f5] font-serif'>
                        <option value='short'>Short (50 words)</option>
                        <option
                          value='medium'
                          selected
                        >
                          Medium (150 words)
                        </option>
                        <option value='long'>Long (300 words)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className='bg-black/30 backdrop-blur-sm border border-[#991b1b]/30 rounded-lg p-6'>
                  <h3 className='text-lg font-serif text-[#991b1b] mb-4'>
                    System Statistics
                  </h3>
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <div className='text-center'>
                      <div className='text-2xl font-serif text-[#991b1b]'>
                        {users.length}
                      </div>
                      <div className='text-sm font-serif text-[#991b1b]/70'>
                        Total Users
                      </div>
                    </div>
                    <div className='text-center'>
                      <div className='text-2xl font-serif text-[#991b1b]'>
                        {trainingData.length}
                      </div>
                      <div className='text-sm font-serif text-[#991b1b]/70'>
                        Training Entries
                      </div>
                    </div>
                    <div className='text-center'>
                      <div className='text-2xl font-serif text-[#991b1b]'>
                        {
                          trainingData.filter((t) => t.status === 'approved')
                            .length
                        }
                      </div>
                      <div className='text-sm font-serif text-[#991b1b]/70'>
                        Approved Responses
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </main>
  )
}
