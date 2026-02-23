'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Package, Play, Clock, CreditCard, Star, TrendingUp,
  ArrowRight, Download, Zap, Activity, BarChart3
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useAgentStore } from '@/store/agentStore';
import { useExecutionStore } from '@/store/executionStore';
import { useIdleActivityStore, getActivityLabel, isActiveActivity } from '@/store/idleActivityStore';
import { Button } from '@/components/common/Button';
import { EmptyState } from '@/components/common/Loading';
import { formatPrice, formatRelativeTime, formatNumber, truncate, getCategoryLabel } from '@/lib/utils';

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuthStore();
  const { purchasedAgents, fetchPurchasedAgents } = useAgentStore();
  const { sessions, fetchSessions } = useExecutionStore();
  const { activities, logs: idleLogs, subscribe: subscribeIdle } = useIdleActivityStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchPurchasedAgents();
      fetchSessions();
    }
  }, [isAuthenticated, fetchPurchasedAgents, fetchSessions]);

  // Subscribe to idle activity WS events
  useEffect(() => {
    if (isAuthenticated) {
      const cleanup = subscribeIdle();
      return cleanup;
    }
  }, [isAuthenticated, subscribeIdle]);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-full">
        <EmptyState
          icon={<BarChart3 size={48} />}
          title="Sign in to view dashboard"
          action={{ label: 'Sign In', onClick: () => window.location.href = '/auth/login' }}
        />
      </div>
    );
  }

  const recentSessions = sessions.slice(0, 5);
  const completedSessions = sessions.filter(s => s.status === 'COMPLETED').length;
  const totalExecutions = sessions.length;

  return (
    <div className="max-w-6xl mx-auto space-y-8 px-6 py-12">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold mb-1">
          Welcome back, {user?.displayName?.split(' ')[0] || 'User'}
        </h1>
        <p className="text-text-secondary">Here&apos;s an overview of your AI workspace</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={<Package size={20} />} label="Purchased Agents" value={purchasedAgents.length} />
        <StatCard icon={<Activity size={20} />} label="Total Executions" value={totalExecutions} />
        <StatCard icon={<Zap size={20} />} label="Completed" value={completedSessions} />
        <StatCard icon={<Clock size={20} />} label="This Week" value={sessions.filter(s => {
          const d = new Date(s.createdAt);
          const now = new Date();
          return now.getTime() - d.getTime() < 7 * 24 * 60 * 60 * 1000;
        }).length} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Purchased agents */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold flex items-center gap-2">
              <Package size={16} className="text-text-tertiary" />
              My Agents
            </h2>
            <Link href="/marketplace">
              <span className="text-xs text-text-tertiary hover:text-text-primary flex items-center gap-1 transition-colors">
                Browse more <ArrowRight size={12} />
              </span>
            </Link>
          </div>
          {purchasedAgents.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-sm text-text-tertiary mb-3">No agents yet</p>
              <Link href="/marketplace">
                <Button variant="secondary" size="sm">Browse Marketplace</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {purchasedAgents.slice(0, 5).map((agent) => {
                const idle = activities[agent.id];
                const isActive = idle && isActiveActivity(idle.activity);
                const stale = idle && (Date.now() - new Date(idle.timestamp).getTime() > 3 * 60 * 1000);
                const showActivity = idle && !stale;

                return (
                <Link
                  key={agent.id}
                  href={`/marketplace/${agent.slug || agent.id}`}
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-bg-elevated transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-bg-elevated flex items-center justify-center text-text-tertiary relative">
                    <Package size={14} />
                    {showActivity && (
                      <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-bg-primary ${
                        isActive ? 'bg-success animate-pulse' : 'bg-text-tertiary'
                      }`} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{agent.name}</div>
                    {showActivity ? (
                      <div className={`text-xs truncate ${isActive ? 'text-success' : 'text-text-tertiary'}`}>
                        {getActivityLabel(idle.activity, idle.detail)}
                      </div>
                    ) : (
                      <div className="text-xs text-text-tertiary">{getCategoryLabel(agent.category)}</div>
                    )}
                  </div>
                  <Link href={`/workspace?agents=${agent.id}`}>
                    <Button variant="ghost" size="sm" icon={<Play size={12} />}>Run</Button>
                  </Link>
                </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Sessions */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold flex items-center gap-2">
              <Clock size={16} className="text-text-tertiary" />
              Recent Sessions
            </h2>
            <Link href="/workspace">
              <span className="text-xs text-text-tertiary hover:text-text-primary flex items-center gap-1 transition-colors">
                View all <ArrowRight size={12} />
              </span>
            </Link>
          </div>
          {recentSessions.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-sm text-text-tertiary mb-3">No sessions yet</p>
              <Link href="/workspace">
                <Button variant="secondary" size="sm">Open Workspace</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {recentSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-bg-elevated transition-colors"
                >
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    session.status === 'COMPLETED' ? 'bg-success'
                    : session.status === 'RUNNING' ? 'bg-accent animate-pulse'
                    : session.status === 'FAILED' ? 'bg-error'
                    : 'bg-text-tertiary'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm truncate">{truncate(session.prompt || 'No prompt', 40)}</div>
                    <div className="text-xs text-text-tertiary">
                      {session.agents?.length || 0} agents · {formatRelativeTime(session.createdAt)}
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-bg-elevated text-text-tertiary capitalize">
                    {session.status?.toLowerCase()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Agent Activity Log */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold flex items-center gap-2">
            <Activity size={16} className="text-success" />
            Agent Activity Log
            {idleLogs.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            )}
          </h2>
          <span className="text-xs text-text-tertiary">
            {idleLogs.length > 0 ? `${idleLogs.length} events` : 'Waiting for activity...'}
          </span>
        </div>
        {idleLogs.length > 0 ? (
          <div className="space-y-1.5 max-h-64 overflow-y-auto">
            {idleLogs.slice(0, 20).map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-2 p-2 rounded-lg text-xs"
              >
                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                  isActiveActivity(log.activity) ? 'bg-success animate-pulse'
                  : log.activity === 'error' ? 'bg-error'
                  : 'bg-text-tertiary'
                }`} />
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-text-primary">{log.agentName}</span>
                  <span className="text-text-tertiary mx-1">-</span>
                  <span className={`${isActiveActivity(log.activity) ? 'text-success' : 'text-text-secondary'}`}>
                    {getActivityLabel(log.activity, log.detail)}
                  </span>
                </div>
                <span className="text-text-tertiary flex-shrink-0">
                  {formatRelativeTime(log.timestamp)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-text-tertiary text-sm">
            <Activity size={24} className="mx-auto mb-2 opacity-30" />
            <p>Idle engine is initializing...</p>
            <p className="text-xs mt-1 opacity-70">Agents will start engaging with the community shortly</p>
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/workspace" className="block">
          <div className="card card-hover p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
              <Play size={18} className="text-success" />
            </div>
            <div>
              <div className="font-medium text-sm">Start Execution</div>
              <div className="text-xs text-text-tertiary">Run agents in the workspace</div>
            </div>
          </div>
        </Link>
        <Link href="/marketplace" className="block">
          <div className="card card-hover p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <Download size={18} className="text-accent" />
            </div>
            <div>
              <div className="font-medium text-sm">Get Agents</div>
              <div className="text-xs text-text-tertiary">Browse the marketplace</div>
            </div>
          </div>
        </Link>
        <Link href="/settings" className="block">
          <div className="card card-hover p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
              <Star size={18} className="text-warning" />
            </div>
            <div>
              <div className="font-medium text-sm">Configure LLM</div>
              <div className="text-xs text-text-tertiary">Set up your AI provider</div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-4"
    >
      <div className="flex items-center gap-3">
        <div className="text-text-tertiary">{icon}</div>
        <div>
          <div className="text-2xl font-bold">{formatNumber(value)}</div>
          <div className="text-xs text-text-tertiary">{label}</div>
        </div>
      </div>
    </motion.div>
  );
}
