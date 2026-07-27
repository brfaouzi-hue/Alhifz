import { useState, useEffect, useCallback } from 'react';


import { supabase } from '../supabase';

// Récupère le display_name de plusieurs utilisateurs en une requête (ex: noms des
// élèves d'une classe, ou nom du prof d'une classe). Retourne un cache {id: name}
// qui s'enrichit au fil des appels sans jamais perdre ce qui a déjà été chargé.
export function useProfiles(ids) {
  const [profiles, setProfiles] = useState({});
  const key = (ids || []).filter(Boolean).slice().sort().join(',');
  useEffect(() => {
    const uniq = [...new Set((ids || []).filter(Boolean))];
    if (!uniq.length) return;
    supabase.from('profiles').select('id, display_name').in('id', uniq)
      .then(({ data }) => {
        setProfiles(prev => {
          const next = { ...prev };
          (data || []).forEach(p => { next[p.id] = p.display_name; });
          return next;
        });
      });
  }, [key]);
  return profiles;
}

export function useMyProfile(userId) {
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    supabase.from('profiles').select('display_name').eq('id', userId).single()
      .then(({ data }) => { setDisplayName(data?.display_name || ''); setLoading(false); });
  }, [userId]);
  const updateDisplayName = useCallback(async (name) => {
    const clean = (name || '').trim();
    if (!clean) return { error: 'Nom vide' };
    const { error } = await supabase.from('profiles').upsert({ id: userId, display_name: clean }, { onConflict: 'id' });
    if (!error) setDisplayName(clean);
    return { error: error?.message };
  }, [userId]);
  return { displayName, loading, updateDisplayName };
}

export function useRole(userId) {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    supabase.from('user_roles').select('role').eq('user_id', userId).single()
      .then(({ data }) => { setRole(data?.role || 'student'); setLoading(false); });
  }, [userId]);
  const setUserRole = useCallback(async (newRole) => {
    const { error } = await supabase.from('user_roles').upsert({ user_id: userId, role: newRole }, { onConflict: 'user_id' });
    if (!error) setRole(newRole);
    return { error: error?.message };
  }, [userId]);
  return { role, loading, setUserRole };
}

export function useTeacherClasses(userId) {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    if (!userId) { setLoading(false); return; }
    const { data } = await supabase.from('classes').select('*, class_members(count)').eq('teacher_id', userId).order('created_at', { ascending: false });
    setClasses(data || []);
    setLoading(false);
  }, [userId]);
  useEffect(() => { load(); }, [load]);
  const createClass = useCallback(async (name) => {
    const { data, error } = await supabase.from('classes').insert({ teacher_id: userId, name }).select().single();
    if (!error) setClasses(prev => [data, ...prev]);
    return { data, error };
  }, [userId]);
  const deleteClass = useCallback(async (classId) => {
    await supabase.from('classes').delete().eq('id', classId);
    setClasses(prev => prev.filter(c => c.id !== classId));
  }, []);
  return { classes, loading, createClass, deleteClass, reload: load };
}

export function useClassStudents(classId) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!classId) { setLoading(false); return; }
    setLoading(true);
    // class_members et user_progress référencent tous les deux auth.users mais pas
    // l'un l'autre — pas de relation directe pour un embed PostgREST, donc deux
    // requêtes fusionnées côté client au lieu d'un join impossible.
    supabase.from('class_members').select('student_id, joined_at').eq('class_id', classId)
      .then(async ({ data: members }) => {
        const list = members || [];
        if (!list.length) { setStudents([]); setLoading(false); return; }
        const { data: progress } = await supabase.from('user_progress')
          .select('user_id, mem, spaced, updated_at')
          .in('user_id', list.map(m => m.student_id));
        const progressMap = {};
        (progress || []).forEach(p => { progressMap[p.user_id] = p; });
        setStudents(list.map(m => ({ ...m, user_progress: progressMap[m.student_id] || null })));
        setLoading(false);
      });
  }, [classId]);
  return { students, loading };
}

export function useAssignments(classId) {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    if (!classId) { setLoading(false); return; }
    const { data } = await supabase.from('assignments').select('*, assignment_progress(student_id, verses_done, completed)').eq('class_id', classId).order('due_date', { ascending: true });
    setAssignments(data || []);
    setLoading(false);
  }, [classId]);
  useEffect(() => { load(); }, [load]);
  const createAssignment = useCallback(async (payload) => {
    const { data, error } = await supabase.from('assignments').insert({ class_id: classId, ...payload }).select().single();
    if (!error) await load();
    return { data, error };
  }, [classId, load]);
  const deleteAssignment = useCallback(async (id) => {
    await supabase.from('assignments').delete().eq('id', id);
    setAssignments(prev => prev.filter(a => a.id !== id));
  }, []);
  return { assignments, loading, createAssignment, deleteAssignment };
}

export function useJoinClass(userId) {
  const joinByCode = useCallback(async (code) => {
    const { data: cls, error: findErr } = await supabase.from('classes').select('id, name').eq('invite_code', code.toUpperCase().trim()).single();
    if (findErr || !cls) return { error: 'Code invalide' };
    const { error: joinErr } = await supabase.from('class_members').insert({ class_id: cls.id, student_id: userId });
    if (joinErr?.code === '23505') return { error: 'Tu es deja dans cette classe' };
    if (joinErr) return { error: joinErr.message };
    return { data: cls };
  }, [userId]);
  return { joinByCode };
}

export function useStudentClasses(userId) {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    supabase.from('class_members').select('joined_at, classes(id, name, invite_code, teacher_id)').eq('student_id', userId)
      .then(({ data }) => { setClasses((data || []).map(m => m.classes)); setLoading(false); });
  }, [userId]);
  return { classes, loading };
}

// Devoirs vus côté élève : les profs créent des assignments (table `assignments`)
// mais rien ne les affichait jamais côté élève, et personne n'écrivait dans
// `assignment_progress` — donc le compteur "fait/total" du prof restait à 0/N.
// On calcule la progression ici depuis les versets déjà mémorisés par l'élève
// (user_progress.mem, la même source que tout le reste de l'app) et on la
// synchronise silencieusement vers assignment_progress pour que le tableau de
// bord prof reste juste.
export function useStudentAssignments(userId) {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    if (!userId) { setLoading(false); return; }
    setLoading(true);
    const { data: memberships } = await supabase.from('class_members').select('class_id, classes(id, name, teacher_id)').eq('student_id', userId);
    const classIds = [...new Set((memberships || []).map(m => m.class_id).filter(Boolean))];
    if (!classIds.length) { setAssignments([]); setLoading(false); return; }
    const clsMap = {};
    (memberships || []).forEach(m => { if (m.classes) clsMap[m.class_id] = m.classes; });
    const [{ data: rows }, { data: prog }] = await Promise.all([
      supabase.from('assignments').select('*').in('class_id', classIds).order('due_date', { ascending: true }),
      supabase.from('user_progress').select('mem').eq('user_id', userId).single(),
    ]);
    const mem = prog?.mem || {};
    const list = (rows || []).map(a => {
      const surahMem = mem[a.surah_n] || {};
      let done = 0;
      for (let v = a.verse_from; v <= a.verse_to; v++) if (surahMem[v]) done++;
      const total = a.verse_to - a.verse_from + 1;
      return { ...a, class_name: clsMap[a.class_id]?.name || '', done, total, completed: done >= total };
    });
    setAssignments(list);
    setLoading(false);
    list.forEach(a => {
      supabase.from('assignment_progress')
        .upsert({ assignment_id: a.id, student_id: userId, verses_done: a.done, completed: a.completed }, { onConflict: 'assignment_id,student_id' })
        .then(({ error }) => { if (error) console.warn('assignment_progress sync', error.message); });
    });
  }, [userId]);
  useEffect(() => { load(); }, [load]);
  return { assignments, loading, reload: load };
}

export function useStudySession(userId) {
  const logSession = useCallback(async (surahN, versesCount, durationSec, scoreAvg) => {
    if (!userId) return;
    await supabase.from('study_sessions').insert({ user_id: userId, surah_n: surahN, verses_count: versesCount, duration_sec: durationSec, score_avg: scoreAvg || null });
  }, [userId]);
  return { logSession };
}

export { supabase };
